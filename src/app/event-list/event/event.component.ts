import {Component, Input, OnInit} from '@angular/core';
import { Event } from '../../models/event';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  @Input() event: Event;
  constructor( private eventService: EventsService) { }

  ngOnInit() {
  }

  completeEvent(event: Event) {
    event.complete = true;
    this.eventService.updateEvent(event).subscribe();
  }

  deleteEvent(id: string) {
    this.eventService.deleteEvent(id).subscribe();
  }
}
