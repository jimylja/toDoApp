import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { openCloseAnimation, openCloseShadeAnimation } from './animation';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    openCloseAnimation,
    openCloseShadeAnimation,
  ]
})
export class AddEventComponent implements OnInit {

  constructor() { }
  @Input() popupConfig: {isOpen: boolean};

  ngOnInit() {
  }

  closePopup() {
    this.popupConfig.isOpen = false;
  }

}
