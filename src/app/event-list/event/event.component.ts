import {AfterViewInit, Component, ElementRef, Input, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import { Event } from '../../models/event';
import { PopupConfig } from '../../models/popup';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import {DeleteEvent, UpdateEvent} from '../../state/app.actions';
import {trigger, keyframes, animate, transition, style, state} from '@angular/animations';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
export class EventComponent implements AfterViewInit {

  @Input() event: Event;
  @ViewChildren('EventRef') EventRef: QueryList<ElementRef>;

  animationState: string;
  eventCard: HTMLDListElement;
  popupConfig: PopupConfig = {isOpen: false};

  constructor(private store: Store<AppState>) { }

  ngAfterViewInit() {
    if (this.EventRef.first) {
      this.eventCard = this.EventRef.first.nativeElement;
    }
    this.popupConfig.event = this.event;
  }

  completeEvent(isComplete: boolean = this.event.complete): void {
    this.event.complete = isComplete;
    this.store.dispatch(new UpdateEvent(this.event));
  }

  deleteEvent(): void {
    this.store.dispatch(new DeleteEvent(this.event));
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
        setTimeout( () => { this.deleteEvent(); }, 500 );
      }
    }
  }
}
