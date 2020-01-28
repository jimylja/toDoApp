import * as moment from 'moment';
import { GroupedEvents } from '../models/event';

export interface EventStorage {
  [year: string]: GroupedEvents[];
}

export interface AppState {
  monthlyViewMode: boolean;
  activeDate: moment.Moment;
  events: EventStorage | {};
  activeDateEvents: {[date: string]: GroupedEvents} | null;
}
