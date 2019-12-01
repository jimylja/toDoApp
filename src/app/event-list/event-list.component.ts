import { ElementRef, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { GroupedEvents } from '../models/event';
import * as moment from 'moment';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit, OnChanges {
  @Input() monthlyView: boolean;
  @ViewChild('dates', {static: false}) dates: ElementRef;
  events$: Observable<GroupedEvents>;
  constructor(private eventService: EventsService) { }

  ngOnInit() {
    this.eventService.getEventsForMonth();
    this.events$ = this.eventService.eventsForDisplay$;
    this.eventService.activeDate$.subscribe(
      activeDate => {
        if (this.dates && this.monthlyView) { this.scrollViewToDate(activeDate); }
      }
    );
  }

  ngOnChanges() {
    this.eventService.monthlyMode$.next(this.monthlyView);
    this.events$ = this.eventService.eventsForDisplay$;
  }

  eventClick(activeDay): void {
    const eventDate = moment(activeDay);
    if (!this.eventService.activeDate$.value.isSame(eventDate, 'date')) {
      this.eventService.activeDate$.next(eventDate.clone());
    }
  }

  private scrollViewToDate(activeDate: moment.Moment): void {
    const date = activeDate.format('YYYY-MM-DD');
    const curDateElem = this.dates.nativeElement.querySelector(`[datetime="${date}"]`);
    if (curDateElem) {
      const toPos = curDateElem.offsetTop - window.pageYOffset;
      if (toPos < 0) {
        document.documentElement.scrollTop = toPos;
      } else {
        document.documentElement.scrollTop = curDateElem.offsetTop + 34;
      }
    }
  }
}
