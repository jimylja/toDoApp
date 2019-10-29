import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event, GroupedEvents } from '../models/event';
import { map } from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class EventsService {
  groupedEvents = new BehaviorSubject<GroupedEvents|null>(null);
  constructor( private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get('http://localhost:3000/events').pipe(
      map( (resp: {message: string, events: Event[]}) => {
        this.groupEvents(resp.events);
        return resp.events;
      })
    );
  }

  getGroupedEvents(): Observable<GroupedEvents> {
    this.getEvents().subscribe();
    return this.groupedEvents;
  }

  private groupEvents(events: Event[]): void {
    this.groupedEvents.next(
      events.reduce(
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
      )
    );
  }
}
