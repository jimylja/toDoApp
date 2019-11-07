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

  get eventsForDisplay$() {
    return this.monthlyMode$.value ? this.activeMonthEvents$ : this.activeDayEvents$;
  }

  get activeDayEvents$(): Observable<GroupedEvents> {
    return this.activeDate$.pipe(
      switchMap( (date: moment.Moment) => this.activeMonthEvents$.pipe(
        map( events => {
          const activeDate = date.format('YYYY-MM-DD');
          return {[activeDate]: events[activeDate]};
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
   * updates local cash of events
   * @params events - array of  grouped by date events
   */
  private updateEventsStorage(events: GroupedEvents): void {
    const currentData = this.eventsStorage$.value;
    currentData[this.activeMonth$.value] = events;
    this.eventsStorage$.next(currentData);
  }

}
