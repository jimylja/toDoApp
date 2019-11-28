import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import { Event } from '../../models/event';
import { EventsService } from '../../services/events.service';
import {trigger, keyframes, animate, transition, style, state} from '@angular/animations';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  animations: [
    trigger('eventAnimator', [
      state('slideOutLeft', style({ display: 'none', opacity: 0 })),
      transition('* => slideOutLeft', animate(1000, keyframes(
        [
          style({ transform: 'translate3d(0, 0, 0)', offset: 0 }),
          style({ transform: 'translate3d(-150%, 0, 0)', opacity: 1, display: 'none', offset: 1 }),
        ]
      ))),
    ])
  ]
})
export class EventComponent implements OnInit, AfterViewInit {

  @Input() event: Event;
  @ViewChildren('EventRef') EventRef: QueryList<ElementRef>;
  animationState: string;
  eventCard: HTMLDListElement;

  constructor(private eventService: EventsService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.eventCard = this.EventRef.first.nativeElement;
  }

  completeEvent(event: Event): void {
    event.complete = true;
    this.eventService.updateEvent(event).subscribe();
  }

  deleteEvent(event: Event): void {
    this.eventService.deleteEvent(event).subscribe();
  }

  moveLeft(moveEvent: any): void {
    this.eventCard.style.transform = `translateX(${moveEvent.deltaX}px)`;
    if (moveEvent.deltaX < -100 && this.animationState !== 'slideOutLeft') {
      this.startAnimation('slideOutLeft');
    }
  }

  panEnd(): void {
    this.eventCard.style.transform = `translateX(0px)`;
  }

  startAnimation(st: string): void {
    if (!this.animationState) {
      this.animationState = st;
      if (this.animationState === 'slideOutLeft') {
        setTimeout( () => { this.deleteEvent(this.event); }, 500 );
      }
    }
  }
}
