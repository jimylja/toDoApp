import {Component, Input} from '@angular/core';
import * as moment from 'moment';

import {select, Store} from '@ngrx/store';
import {getActiveMonthEvents} from '../state';
import {AppState} from '../state/app.state';
import {ChangeActiveDate, ChangeActiveMonth} from '../state/app.actions';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})

export class CalendarComponent {
  today = moment();
  monthFirstDay: moment.Moment;
  groupedEvents$ = this.store.pipe(select(getActiveMonthEvents));
  moment: any = moment;
  @Input() activeDate;

  constructor(private store: Store<AppState>) { }

  /**
   * return's dates for displayed month
   */
  get calendar(): Array<Array<moment.Moment>> {
    if (this.activeDate) {
      return this.getMonthCalendar(this.activeDate.month(), this.activeDate.year());
    }
    return this.getMonthCalendar(this.moment().month(), this.moment().year());
  }

  /**
   * return's dates for month
   * @param month number - index of displayed month
   * @param year number - year of displayed month
   * @returns array - array of dates grouped by weeks
   */
  getMonthCalendar(month: number, year: number) {
    this.monthFirstDay = moment([year, month, 1]);
    const lastDay = this.monthFirstDay.clone().endOf('month');
    let monday = this.monthFirstDay.clone().startOf('isoWeek');
    const displayedWeeks = lastDay.diff(monday, 'weeks');

    const monthDates = [];
    for (let i = 0; i <= displayedWeeks; i++) {
      const weekDates = [];
      for (let j = 0; j < 7; j++) {
        weekDates.push(monday.clone().add(j, 'days'));
      }
      monthDates.push(weekDates);
      monday = monday.clone().add(7, 'days');
    }
    return monthDates;
  }

  /**
   * changes the active month
   * @param direction number - next month: 1; previous month: -1
   */
  changeMonth(direction: number): void {
    this.store.dispatch(new ChangeActiveMonth(direction));
  }

  /**
   * changes the active date
   * @param day moment.Moment - Moment object with selected date
   */
  changeActiveDate(day: moment.Moment) {
    this.store.dispatch(new ChangeActiveDate(day));
  }
}
