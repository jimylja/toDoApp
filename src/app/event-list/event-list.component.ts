import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
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
  events$: Observable<GroupedEvents>;
  constructor(private eventService: EventsService) { }

  ngOnInit() {
    this.eventService.getEventsForMonth();

  }

  ngOnChanges() {
    this.eventService.monthlyMode$.next(this.viewMode);
    this.events$  = this.eventService.eventsForDisplay$;
  }
}
