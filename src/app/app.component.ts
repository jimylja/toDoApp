import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import { EventsService } from './services/events.service';
import { Store, select} from '@ngrx/store';
import { getMonthlyViewMode } from './state';
import { AppState } from './state/app.state';
import { ToggleViewMode } from './state/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  monthlyView = true;
  monthlyView$ = this.store.pipe(select(getMonthlyViewMode));

  activeDate = this.eventService.activeDate$;
  constructor(
    private store: Store<AppState>,
    private eventService: EventsService) { moment.locale('uk'); }

  ngOnInit(): void {
    this.monthlyView$.subscribe(
      view => this.monthlyView = view
    );
  }

  changeMonthView(isActive: boolean): void {
    this.store.dispatch(new ToggleViewMode(isActive));
  }

}
