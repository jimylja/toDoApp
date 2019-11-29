import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event, GroupedEvents } from '../models/event';
import {map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class EventsService {
  private today = moment();
  private eventsStorage$ = new BehaviorSubject<GroupedEvents[]|null>([].fill(null, 0, 11));
  monthlyMode$ = new BehaviorSubject<boolean>(true);
  activeMonthEvents$ = new BehaviorSubject<GroupedEvents|null>(null);

  activeYear$ = new BehaviorSubject<number>(this.today.year());
  activeMonth$ = new BehaviorSubject<number>(this.today.month());
  activeDate$ = new BehaviorSubject<moment.Moment>(this.today);
  constructor( private http: HttpClient) { }

  get eventsForDisplay$(): Observable<GroupedEvents | null> {
    return this.monthlyMode$.value ? this.activeMonthEvents$ : this.activeDayEvents$;
  }

  get activeDayEvents$(): Observable<GroupedEvents> {
    return this.activeDate$.pipe(
      switchMap( (date: moment.Moment) => this.activeMonthEvents$.pipe(
        map( events => {
          const activeDate = date.format('YYYY-MM-DD');
          if (activeDate in events) {
            return {[activeDate]: events[activeDate]};
          } else {
            return {};
          }
        })
      ))
    );
  }

  /**
   * updates active month and year
   * @param direction number - next month: 1; previous month: -1
   */
  changeMonth(direction: 1|-1): void {
    const nextMonth = this.activeMonth$.value + direction;
    const curYear = this.activeYear$.value;

    if (nextMonth < 12 && nextMonth >= 0) {
      this.activeMonth$.next(nextMonth);
    } else {
      if (nextMonth === 12) {
        this.activeMonth$.next(0);
        this.activeYear$.next(curYear + 1);
      }
      if (nextMonth === -1) {
        this.activeMonth$.next(11);
        this.activeYear$.next(curYear - 1);
      }
    }
    this.activeDate$.next(moment([this.activeYear$.value, this.activeMonth$.value, 1]));
    this.getEventsForMonth();
  }

  /**
   * gets events for active month from server of from cash
   */
  getEventsForMonth(): any {
    const eventsForMonth = this.eventsStorage$.value[this.activeMonth$.value];
    if (eventsForMonth !== undefined) {
      this.activeMonthEvents$.next(eventsForMonth);
    } else {
      this.getEvents().subscribe();
    }
  }

  /**
   * return's events for active month
   * @returns GroupedEvents - object were events are grouped by date
   */
  private getEvents(): Observable<GroupedEvents> {
    return this.http.get('http://localhost:3000/events', {
      params: {
        month: String(this.activeMonth$.value),
        year: String(this.activeYear$.value)
      },
    }).pipe(
      map( (resp: {message: string, events: Event[]}) => {
        const eventsForMonth = this.groupEventsByDay(resp.events);
        this.updateEventsStorage(eventsForMonth);
        this.activeMonthEvents$.next(eventsForMonth);
        return eventsForMonth;
      })
    );
  }

  /**
   * updates event on server
   * @params event - object with updated data
   * @return - updated event
   */
  updateEvent(event: Event): void {
    this.http.put('http://localhost:3000/events', event).pipe(
      map((resp: {message: string, event: Event}) => {
        return resp.event;
      })
    ).subscribe(updatedEvent => this.updateEventsStorage(updatedEvent));
  }

  /**
   * delete event on server
   * @params event - object with updated data
   */
  deleteEvent(event: Event): Observable<any> {
    this.updateEventsStorage(event, true);
    const id = event._id;
    return this.http.delete(`http://localhost:3000/events`, {params: {id}});
  }

  /**
   * create new event on server
   * @params eventData - object with data for new event
   */
  addEvent(eventData): void {
    this.http.post(`http://localhost:3000/events`, eventData).pipe(
      map((resp: {message: string, event: Event}) => resp.event)
    ).subscribe( event => this.updateEventsStorage(event) );
  }

  /**
   * groups's events by date
   * @params events - array of events
   * @returns GroupedEvents - object were events are grouped by date
   */
  private groupEventsByDay(events: Event[]): GroupedEvents {
    return events.reduce(
      (groupedEvents, event) => {
        if ( moment(event.startDate).format('YYYY-MM-DD') in groupedEvents) {
          groupedEvents[moment(event.startDate).format('YYYY-MM-DD')].events.push(event);
          groupedEvents[moment(event.startDate).format('YYYY-MM-DD')].categories.add(event.category.color);
        } else {
          groupedEvents[moment(event.startDate).format('YYYY-MM-DD')] = {events: [event], categories: new Set([event.category.color])};
        }
        return groupedEvents;
      },
      {}
    );
  }

  /**
   * updates local cash of events
   * @params events - array of grouped by date events or single event object
   * @params isDeleteAction - array of grouped by date events or single event object
   */
  private updateEventsStorage(events: GroupedEvents|Event, isDeleteAction?: boolean): void {
    const storageData = this.eventsStorage$.value;
    if (events.hasOwnProperty('_id')) {
      const event = events as Event;
      const eventDate = moment(event.startDate).format('YYYY-MM-DD');
      const monthlyEvents = Object.assign(storageData[this.activeMonth$.value]);
      const isDateWithoutEvents = !monthlyEvents.hasOwnProperty(eventDate);
      if (isDateWithoutEvents) {
        monthlyEvents[eventDate] = {events: [event], categories: new Set([event.category.color])};
      } else {
        const currentEventPos = monthlyEvents[eventDate].events.findIndex( item => event._id === item._id);
        const isUpdateAction = currentEventPos !== -1;
        if (isDeleteAction) {
          monthlyEvents[eventDate].events.splice(currentEventPos, 1);
          if (monthlyEvents[eventDate].events.length === 0 ) {
            delete monthlyEvents[eventDate];
            if (Object.entries(monthlyEvents).length === 0) {
              storageData.splice(this.activeMonth$.value, 1);
            }
          }
        } else {
          if (isUpdateAction) {
            monthlyEvents[eventDate].events[currentEventPos] = event;
          } else {
            monthlyEvents[eventDate].events.push(event);
            monthlyEvents[eventDate].categories.add(event.category.color);
          }
        }
      }
      events = monthlyEvents;
    }
    storageData[this.activeMonth$.value] = events as GroupedEvents;
    this.eventsStorage$.next(storageData);
  }
}
