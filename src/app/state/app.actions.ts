import { Action } from '@ngrx/store';
import * as moment from 'moment';
import { GroupedEvents, Event } from '../models/event';

export enum StateActionTypes {
  ToggleViewMode = 'Toggle View Mode',
  ChangeActiveDate = 'Change The Active Date',
  ChangeActiveMonth = 'Change The Active Month',
  LoadEventsForMonth = 'Load Events For Month',
  MonthlyEventsFetched = 'Events Loaded Successfully',
  CreateEvent = 'Create New Event',
  CreateEventSuccess = 'New Event Was Created Successfully',
  DeleteEvent = 'Delete Event',
  DeleteEventSuccess = 'Event Was Deleted Successfully',
  UpdateEvent = 'Update Event',
  UpdateEventSuccess = 'Event Was Updated Successfully'
}

export class ToggleViewMode implements Action {
  readonly type = StateActionTypes.ToggleViewMode;
  constructor(public payload: boolean) {}
}

export class ChangeActiveDate implements Action {
  readonly type = StateActionTypes.ChangeActiveDate;
  constructor(public payload: moment.Moment) {}
}

export class ChangeActiveMonth implements Action {
  readonly type = StateActionTypes.ChangeActiveMonth;
  constructor(public payload: number) {}
}

export class LoadEventsForMonth implements Action {
  readonly type = StateActionTypes.LoadEventsForMonth;
}

export class LoadSuccess implements Action {
  readonly type = StateActionTypes.MonthlyEventsFetched;
  constructor(public payload: GroupedEvents) {}
}

export class CreateEvent implements Action {
  readonly type = StateActionTypes.CreateEvent;
  constructor(public payload: Event) {}
}

export class CreateEventSuccess implements Action {
  readonly type = StateActionTypes.CreateEventSuccess;
  constructor(public payload: Event) {}
}

export class DeleteEvent implements Action {
  readonly type = StateActionTypes.DeleteEvent;
  constructor(public payload: Event) {}
}

export class DeleteEventSuccess implements Action {
  readonly type = StateActionTypes.DeleteEventSuccess;
  constructor(public payload: Event) {}
}

export class UpdateEvent implements Action {
  readonly type = StateActionTypes.UpdateEvent;
  constructor(public payload: Event) {}
}

export class UpdateEventSuccess implements Action {
  readonly type = StateActionTypes.UpdateEventSuccess;
  constructor(public payload: Event) {}
}

export type AppActions = ToggleViewMode
  |ChangeActiveDate
  |ChangeActiveMonth
  |LoadEventsForMonth
  |LoadSuccess
  |CreateEvent
  |CreateEventSuccess
  |DeleteEvent
  |DeleteEventSuccess
  |UpdateEvent
  |UpdateEventSuccess;
