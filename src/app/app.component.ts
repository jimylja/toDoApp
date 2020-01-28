import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import { Store, select} from '@ngrx/store';
import { getMonthlyViewMode, getActiveDate } from './state';
import { AppState } from './state/app.state';
import { ToggleViewMode, LoadEventsForMonth } from './state/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  monthlyView = true;
  monthlyView$ = this.store.pipe(select(getMonthlyViewMode));
  activeDate$ = this.store.pipe(select(getActiveDate));

  constructor(private store: Store<AppState>) { moment.locale('uk'); }

  ngOnInit(): void {
    this.store.dispatch(new LoadEventsForMonth());
    this.monthlyView$.subscribe(
      view => this.monthlyView = view
    );
   }

  changeMonthView(isActive: boolean): void {
    this.store.dispatch(new ToggleViewMode(isActive));
  }
}
