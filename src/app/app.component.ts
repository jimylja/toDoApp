import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {select, Store} from '@ngrx/store';
import {getActiveDate, getMonthlyViewMode} from './state';
import {AppState} from './state/app.state';
import {LoadEventsForMonth, ToggleViewMode} from './state/app.actions';
import {shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  monthlyView$: Observable<boolean> = this.store.pipe(select(getMonthlyViewMode), shareReplay());
  activeDate$: Observable<moment.Moment> = this.store.pipe(select(getActiveDate),
    shareReplay()
  );

  constructor(private store: Store<AppState>) { moment.locale('uk'); }

  ngOnInit(): void {
    this.store.dispatch(new LoadEventsForMonth());
   }

  onViewChanged(isActive: boolean): void {
    this.store.dispatch(new ToggleViewMode(isActive));
  }
}
