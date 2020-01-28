import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event, GroupedEvents } from '../models/event';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class EventsService {
  constructor( private http: HttpClient) { }

  /**
   * return's events for active month
   * @returns GroupedEvents - object were events are grouped by date
   */
  getEvents(date: moment.Moment = moment()): Observable<GroupedEvents> {
    return this.http.get('/events', {
      params: {
        month: String(date.month()),
        year: String(date.year())
      },
    }).pipe(
      map((resp: {message: string, events: Event[]}) => {
        return this.groupEventsByDay(resp.events);
      })
    );
  }

  /**
   * create new event on server
   * @params eventData - object with data for new event
   * @returns event - the event object that was created
   */
  addEvent(eventData): Observable<Event> {
    return this.http.post(`/events`, eventData).pipe(
      map((resp: {message: string, event: Event}) => resp.event)
    );
  }

  /**
   * updates event on server
   * @params event - object with updated data
   * @return - updated event
   */
  updateEvent(event: Event): Observable<Event> {
    return this.http.put('/events', event).pipe(
      map((resp: {message: string, event: Event}) => {
        return resp.event;
      })
    );
  }

  /**
   * delete event on server
   * @params event - object with updated data
   * @returns - id of deleted event
   */
  deleteEvent(id: string): Observable<string> {
    return this.http.delete(`/events`, {params: {id}}).pipe(
      map(
        (resp: {message: string, id: string}) => resp.id
      )
    );
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
}
