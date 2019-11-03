import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import {Observable} from 'rxjs';
import {Event, GroupedEvents} from '../models/event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  events$: Observable<GroupedEvents>;
  constructor(private eventService: EventsService) { }

  ngOnInit() {
    this.eventService.getEventsForMonth();
    this.events$ = this.eventService.eventsForDisplay$;
  }
}
