import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event, GroupedEvents } from '../models/event';
import {map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import * as moment from 'moment';

export enum StoreActions {
  addEvent,
  updateEvent,
  deleteEvent,
  updateMonth
}

export interface EventStorage {
  [year: number]: GroupedEvents[];
}

@Injectable({
  providedIn: 'root'
})

export class EventsService {
  private today = moment();
  private eventsStorage$ = new BehaviorSubject<EventStorage|null>( { [this.today.year()]: [].fill(null, 0, 11)});
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
  changeMonth(direction: number): void {
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
      this.activeMonthEvents$.next(eventsForMonth[this.activeYear$.value]);
    } else {
      this.getEvents().subscribe();
    }
  }

  /**
   * return's events for active month
   * @returns GroupedEvents - object were events are grouped by date
   */
  private getEvents(): Observable<GroupedEvents> {
    return this.http.get('/events', {
      params: {
        month: String(this.activeMonth$.value),
        year: String(this.activeYear$.value)
      },
    }).pipe(
      map( (resp: {message: string, events: Event[]}) => {
        const eventsForMonth = this.groupEventsByDay(resp.events);
        this.updateEventsStorage(eventsForMonth, StoreActions.updateMonth);
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
    this.http.put('/events', event).pipe(
      map((resp: {message: string, event: Event}) => {
        return resp.event;
      })
    ).subscribe(updatedEvent => this.updateEventsStorage(updatedEvent, StoreActions.updateEvent));
  }

  /**
   * delete event on server
   * @params event - object with updated data
   */
  deleteEvent(event: Event): void {
    this.updateEventsStorage(event, StoreActions.deleteEvent);
    const id = event._id;
    this.http.delete(`/events`, {params: {id}}).subscribe();
  }

  /**
   * create new event on server
   * @params eventData - object with data for new event
   */
  addEvent(eventData): void {
    this.http.post(`/events`, eventData).pipe(
      map((resp: {message: string, event: Event}) => resp.event)
    ).subscribe( event => this.updateEventsStorage(event, StoreActions.addEvent) );
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
   * @params action - type of action
   */
  private updateEventsStorage(events: GroupedEvents|Event, action: StoreActions): void {
    const storageData = this.eventsStorage$.value;
    const curYear = this.activeYear$.value;
    storageData[curYear] = storageData[curYear] ? Object.assign(storageData[curYear]) : [].fill(null, 0, 11);
    const curYearData = storageData[curYear];

    if (action === StoreActions.updateMonth) {
      curYearData[this.activeMonth$.value] = events as GroupedEvents;
    } else {
      const event = events as Event;
      const eventMonth = moment(event.startDate).get('month');
      const eventDate = moment(event.startDate).format('YYYY-MM-DD');
      const curMonthEvents = curYearData[eventMonth] ? Object.assign(curYearData[eventMonth]) : {};

      switch (action) {
        case StoreActions.updateEvent:
          const oldDate = this.activeDate$.value.format('YYYY-MM-DD');
          const oldMonthEvents = Object.assign(curYearData[this.activeMonth$.value]);
          const oldEvent = oldMonthEvents[oldDate].events.find( item => event._id === item._id);
          const isEventForOtherDate = !this.activeDate$.value.isSame(moment(event.startDate), 'date');
          if (isEventForOtherDate) {
            this.updateMonthInStorage(oldEvent, true);
            this.updateMonthInStorage(event);
          } else {
            const currentEventPos = curMonthEvents[eventDate].events.findIndex( item => event._id === item._id);
            curMonthEvents[eventDate].events[currentEventPos] = event;
          }
          break;
        case StoreActions.addEvent:
          this.updateMonthInStorage(event);
          break;
        case StoreActions.deleteEvent:
          this.updateMonthInStorage(event, true);
          break;
      }
      curYearData[eventMonth] = curMonthEvents;
      storageData[this.activeYear$.value] = curYearData;
      this.eventsStorage$.next(storageData);
    }
  }

  private updateMonthInStorage(event: Event, isDeleteAction?: boolean) {
    const storageData = this.eventsStorage$.value;
    const date = moment(event.startDate);
    const eventDate = date.format('YYYY-MM-DD');
    storageData[date.year()] = storageData[date.year()] ? Object.assign(storageData[date.year()]) : [].fill(null, 0, 11);
    const curYearData = storageData[date.year()];
    const curMonthEvents = curYearData[date.month()] ? Object.assign(curYearData[date.month()]) : {};

    if (isDeleteAction) {
      const currentEventPos = curMonthEvents[eventDate].events.findIndex( item => event._id === item._id);
      curMonthEvents[eventDate].events.splice(currentEventPos, 1);
      if (curMonthEvents[eventDate].events.length === 0 ) {
        delete curMonthEvents[eventDate];
        if (Object.entries(curMonthEvents).length === 0) {
          curYearData.splice(this.activeMonth$.value, 1);
          if (curYearData.length === 0) {
            delete this.eventsStorage$.value[date.year()];
          }
        }
      }
    } else {
      const isDateWithoutEvents = !curMonthEvents.hasOwnProperty(eventDate);
      if (isDateWithoutEvents) {
        curMonthEvents[eventDate] = {events: [event], categories: new Set([event.category.color])};
      } else {
        curMonthEvents[eventDate].events.push(event);
        curMonthEvents[eventDate].categories.add(event.category.color);
      }
    }
  }
}
