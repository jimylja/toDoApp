import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { Event } from '../../models/event';
import { EventsService } from '../../services/events.service';
import {trigger, keyframes, animate, transition, style, state} from '@angular/animations';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  animations: [
    trigger('eventAnimator', [
      state('slideOutLeft', style({ display: 'none' })),
      transition('* => slideOutLeft', animate(1000, keyframes(
        [
          style({ transform: 'translate3d(0, 0, 0)', offset: 0 }),
          style({ transform: 'translate3d(-150%, 0, 0)', opacity: 0, display: 'none', offset: 1 }),
        ]
      ))),
    ])
  ]
})
export class EventComponent implements OnInit {

  @Input() event: Event;
  @ViewChild('EventRef', {static: true}) eventRef: ElementRef;
  animationState: string;

  constructor(private eventService: EventsService) { }

  ngOnInit() {
  }

  completeEvent(event: Event) {
    event.complete = true;
    this.eventService.updateEvent(event).subscribe();
  }

  deleteEvent(event: Event) {
    this.eventService.deleteEvent(event).subscribe();
  }

  moveLeft(moveEvent: any) {
    this.eventRef.nativeElement.style.transform = `translateX(${moveEvent.deltaX}px)`;
    if (moveEvent.deltaX < -100 && this.animationState !== 'slideOutLeft') {
      this.startAnimation('slideOutLeft');
    }
  }

  startAnimation(st) {
    if (!this.animationState) {
      this.animationState = st;
      if (this.animationState === 'slideOutLeft') {
        this.deleteEvent(this.event);
      }
    }
  }
}
