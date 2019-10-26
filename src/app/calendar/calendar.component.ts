import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  today = moment();
  displayedMonth: moment.Moment;

  constructor() { }

  ngOnInit() {
    this.displayedMonth = this.today.clone().startOf('month');
  }

  /**
   * return's dates for displayed month
   */
  get calendar(): Array<Array<moment.Moment>> {
    return this.getMonthCalendar(this.displayedMonth.month(), this.displayedMonth.year());
  }

  /**
   * return's dates for month
   * @param month number - index of displayed month
   * @param year number - year of displayed month
   * @returns array - array of dates grouped by weeks
   */
  private getMonthCalendar(month: number, year: number) {
    const firstDay = moment([year, month, 1]);
    const lastDay = firstDay.clone().endOf('month');
    let monday = firstDay.clone().startOf('isoWeek');
    const displayedWeeks = lastDay.diff(monday, 'weeks');

    const monthDates = [];
    for ( let i = 0; i <= displayedWeeks; i++) {
      const weekDates = [];
      for (let j = 0; j < 7; j++) {
        weekDates.push(monday.clone().add(j, 'days'));
      }
      monthDates.push(weekDates);
      monday = monday.clone().add(7, 'days');
    }
    return monthDates;
  }

  displayNextMonth(): void {
    this.displayedMonth = this.displayedMonth.add(1, 'month');
  }

  displayPreviousMonth(): void {
    this.displayedMonth = this.displayedMonth.subtract(1, 'month');
  }

}
