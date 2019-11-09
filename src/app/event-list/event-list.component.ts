import {
  ChangeDetectionStrategy,
  ElementRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { GroupedEvents } from '../models/event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListComponent implements OnInit, OnChanges {
  @Input() viewMode: boolean;
  @ViewChild('dates', {static: false}) dates: ElementRef;
  events$: Observable<GroupedEvents>;
  constructor(private eventService: EventsService) { }

  ngOnInit() {
    this.eventService.getEventsForMonth();
    this.eventService.activeDate$.subscribe(
      date => {
        if (this.dates) {
          console.log(' change date');
          const activeDate = date.format('YYYY-MM-DD');
          console.log(activeDate);
          const el = this.dates.nativeElement.querySelector('[datetime="2019-10-23"]');
          el.scrollIntoView({behavior: 'smooth'});
        }
      }
    );
  }

  ngOnChanges() {
    this.eventService.monthlyMode$.next(this.viewMode);
    this.events$  = this.eventService.eventsForDisplay$;
  }
}
