import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {GroupedEvents} from '../models/event';
import {AppState} from '../state/app.state';
import {getActiveDateEvents, getActiveMonthEvents} from '../state';
import {select, Store} from '@ngrx/store';
import {ChangeActiveDate} from '../state/app.actions';
import * as moment from 'moment';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EventListComponent {
  @Input() monthlyView: boolean;
  @Input() activeDate: moment.Moment;
  constructor(private store: Store<AppState>) { }

  eventClick(activeDay): void {
    const eventDate = moment(activeDay);
    if (!moment(this.activeDate).isSame(eventDate, 'date')) {
      this.store.dispatch(new ChangeActiveDate(eventDate.clone()));
    }
  }

  get events$(): Observable<GroupedEvents> {
    return this.monthlyView ? this.store.pipe(select(getActiveMonthEvents)) : this.store.pipe(select(getActiveDateEvents));
  }
}
