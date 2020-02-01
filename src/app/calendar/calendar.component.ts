import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

import {select, Store} from '@ngrx/store';
import {getActiveMonthEvents} from '../state';
import {AppState} from '../state/app.state';
import {ChangeActiveDate, ChangeActiveMonth} from '../state/app.actions';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarComponent implements OnInit {
  today = moment();
  monthFirstDay: moment.Moment;
  groupedEvents$ = this.store.pipe(select(getActiveMonthEvents));
  moment: any = moment;
  calendar: Array<Array<moment.Moment>>;
  @Input() activeDate: moment.Moment;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.calendar = this.getMonthCalendar(this.activeDate.month(), this.activeDate.year());
  }

  /**
   * return's dates for month
   * @param month number - index of displayed month
   * @param year number - year of displayed month
   * @returns array - array of dates grouped by weeks
   */
  getMonthCalendar(month: number, year: number) {
    this.monthFirstDay = moment([year, month, 1]).utc(true);
    const lastDay = this.monthFirstDay.clone().endOf('month');
    let monday = this.monthFirstDay.clone().startOf('isoWeek');
    const displayedWeeks = lastDay.diff(monday, 'weeks');

    const monthDates = [];
    for (let i = 0; i <= displayedWeeks; i++) {
      const weekDates = [];
      for (let j = 0; j < 7; j++) {
        weekDates.push(monday.clone().utc(true).add(j, 'days'));
      }
      monthDates.push(weekDates);
      monday = monday.clone().utc(true).add(7, 'days');
    }
    return monthDates;
  }

  /**
   * changes the active month
   * @param direction number - next month: 1; previous month: -1
   */
  changeMonth(direction: number): void {
    this.store.dispatch(new ChangeActiveMonth(direction));
    const activeDate = this.activeDate.add(direction, 'month');
    this.calendar = this.getMonthCalendar(activeDate.month(), activeDate.year());
  }

  /**
   * changes the active date
   * @param day moment.Moment - Moment object with selected date
   */
  changeActiveDate(day: moment.Moment) {
    if (!this.activeDate.isSame(day, 'date') ) {
      this.store.dispatch(new ChangeActiveDate(day));
      if (!this.activeDate.isSame(day, 'month')) {
        this.calendar = this.getMonthCalendar(day.month(), day.year());
      }
    }
  }
}
