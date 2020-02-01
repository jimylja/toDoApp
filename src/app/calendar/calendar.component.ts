import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

import {select, Store} from '@ngrx/store';
import {getActiveMonthEvents} from '../state';
import {AppState} from '../state/app.state';
import {ChangeActiveDate, ChangeActiveMonth} from '../state/app.actions';
import {Observable} from 'rxjs';
import {GroupedEvents} from '../models/event';

export interface CalendarDate {
  dateObj: moment.Moment;
  dateStr: string;
  pastDate: boolean;
  currentDate: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarComponent implements OnInit {
  monthFirstDay: moment.Moment;
  groupedEvents$: Observable<GroupedEvents> = this.store.pipe(select(getActiveMonthEvents));
  calendar: Array<Array<CalendarDate>>;
  weekDays: Array<string>;
  @Input() activeDate: moment.Moment;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.weekDays = moment.weekdaysMin(true);
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
        const dateObj = monday.clone().utc(true).add(j, 'days');
        const day = {
          dateObj,
          currentDate: dateObj.isSame(moment(), 'day'),
          pastDate: !dateObj.isSame(this.monthFirstDay, 'month'),
          dateStr: dateObj.format('YYYY-MM-DD')
        };
        weekDates.push(day);
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
    const isOtherDateOfMonth = !(this.activeDate.isSame(day, 'date') || !this.activeDate.isSame(day, 'month'));
    if (isOtherDateOfMonth) {
      this.store.dispatch(new ChangeActiveDate(day));
      if (!this.activeDate.isSame(day, 'month')) {
        this.calendar = this.getMonthCalendar(day.month(), day.year());
      }
    }
  }
}
