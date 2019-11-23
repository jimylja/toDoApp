import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

export const openCloseAnimation = trigger('openClose', [
  transition(':enter', [
    animate('0.25s ease', keyframes([
      style({ transform: 'translateY(100%)', offset: 0 }),
      style({ transform: 'translateY(50%)', offset: 0.5 }),
      style({ transform: 'translateY(0%)', offset: 1 })
    ]))
  ]),
  transition(':leave', [
    animate('0.5s ease', keyframes([
      style({ transform: 'translateY(10%)', offset: 0 }),
      style({ transform: 'translateY(50%)', offset: 0.5 }),
      style({ transform: 'translateY(100%)', offset: 1 })
    ]))
  ])
]);

export const openCloseShadeAnimation = trigger('openCloseShade', [
  state('open', style({opacity: .2})),
  state('closed', style({opacity: 0, display: 'none'})),
  transition('open => closed, closed => open', [
    animate('0.25s ease')
  ]),
]);
