import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable} from 'rxjs';
import { GroupedEvents } from '../models/event';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  today = moment();
  monthFirstDay: moment.Moment;
  groupedEvents$: Observable<GroupedEvents>;
  moment: any = moment;

  constructor( private eventService: EventsService) { }

  ngOnInit() {
    this.groupedEvents$ = this.eventService.eventsForDisplay$;
  }

  /**
   * return's dates for displayed month
   */
  get calendar(): Array<Array<moment.Moment>> {
    return this.getMonthCalendar(this.eventService.activeMonth$.value, this.eventService.activeYear$.value);
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
  changeMonth(direction: 1 | -1): void {
    this.eventService.changeMonth(direction);
  }
}
