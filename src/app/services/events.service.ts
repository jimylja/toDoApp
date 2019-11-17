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
            return null;
          }
        })
      ))
    );
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
   * updates event on server
   * @params event - object with updated data
   * @return - updated event
   */
  updateEvent(event: Event): Observable<Event> {
    return this.http.put('http://localhost:3000/events', event).pipe(
      map((resp: {message: string, event: Event}) => {
        return resp.event;
      })
    );
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
   * updates local cash of events
   * @params events - array of  grouped by date events
   */
  private updateEventsStorage(events: GroupedEvents|Event, isDeleteAction?: boolean): void {
    const storageData = this.eventsStorage$.value;
    if (events.hasOwnProperty('_id')) {
      const event = events as Event;
      const eventDate = moment(event.startDate).format('YYYY-MM-DD');
      const monthlyEvents = storageData[this.activeMonth$.value];
      let dailyEvents: Array<Event>;
      if (isDeleteAction) {
        dailyEvents = monthlyEvents[eventDate].events.filter( item => item._id !== event._id );
      } else {
        dailyEvents = monthlyEvents[eventDate].events.map( item => item._id === event._id ? event : item );
      }

      if (dailyEvents.length === 0) {
        delete monthlyEvents[eventDate];
        if (Object.entries(monthlyEvents).length === 0) {
          storageData.splice(this.activeMonth$.value, 1);
        }
      } else {
        storageData[this.activeMonth$.value][eventDate].events = dailyEvents;
      }
      events = storageData[this.activeMonth$.value];
    }

    storageData[this.activeMonth$.value] = events as GroupedEvents;
    this.eventsStorage$.next(storageData);
  }
}
