import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {GroupedEvents} from '../../models/event';
import {AppState} from '../../state/app.state';
import {getActiveDateEvents, getActiveMonthEvents} from '../../state';
import {select, Store} from '@ngrx/store';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EventListComponent {
  @Input() monthlyView: boolean;
  constructor(private store: Store<AppState>) { }

  get events$(): Observable<GroupedEvents> {
    return this.monthlyView ? this.store.pipe(select(getActiveMonthEvents)) : this.store.pipe(select(getActiveDateEvents));
  }
}
