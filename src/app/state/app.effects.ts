import { Injectable } from '@angular/core';

import * as AppActions from './app.actions';
import { EventsService } from '../services/events.service';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {getActiveDate, getActiveMonthEvents} from './index';
import { Store } from '@ngrx/store';
import {filter, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {AppState} from './app.state';
import { Event, GroupedEvents } from '../models/event';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private eventService: EventsService,
    private store: Store<AppState>,
  ) {}

  @Effect()
  getEvents$ = this.actions$.pipe(
    ofType(AppActions.StateActionTypes.LoadEventsForMonth),
    withLatestFrom(this.store.select(getActiveMonthEvents), this.store.select(getActiveDate)),
    filter( ([, eventsForMonth]) => eventsForMonth === null),
    mergeMap( ([, , activeDate]) =>
      this.eventService.getEvents(activeDate).pipe(
        switchMap( (events: GroupedEvents) => {
          return [
            new AppActions.LoadSuccess(events),
            // new AppActions.ChangeActiveDate(activeDate)
          ];
        })
      )
    )
  );

  @Effect()
  changeMonth$ = this.actions$.pipe(
    ofType(AppActions.StateActionTypes.ChangeActiveMonth),
    map(
      () => new AppActions.LoadEventsForMonth()
    )
  );

  @Effect()
  addEvent$ = this.actions$.pipe(
    ofType(AppActions.StateActionTypes.CreateEvent),
    switchMap(
      (action: AppActions.CreateEvent) => this.eventService.addEvent(action.payload).pipe(
        map(
          (newEvent: Event) => new AppActions.CreateEventSuccess(newEvent)
        )
      )
  ));

  @Effect()
  deleteEvent$ = this.actions$.pipe(
    ofType(AppActions.StateActionTypes.DeleteEvent),
    switchMap(
      (action: AppActions.DeleteEvent) => {
        return this.eventService.deleteEvent(action.payload._id).pipe(
         map(
          () => new AppActions.DeleteEventSuccess(action.payload)
          )
        );
      }
    )
  );

  @Effect()
  updateEvent$ = this.actions$.pipe(
    ofType(AppActions.StateActionTypes.UpdateEvent),
    switchMap(
      (action: AppActions.UpdateEvent) => {
        return this.eventService.updateEvent(action.payload).pipe(
          map(
            (updatedEvent: Event) => new AppActions.UpdateEventSuccess(updatedEvent)
          )
        );
      }
    )
  );
}
