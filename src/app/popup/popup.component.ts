import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { openCloseAnimation, openCloseShadeAnimation } from './animation';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    openCloseAnimation,
    openCloseShadeAnimation,
  ]
})
export class PopupComponent implements OnInit {

  constructor() { }
  @Input() popupConfig: {isOpen: boolean};

  ngOnInit() {
  }

  closePopup() {
    this.popupConfig.isOpen = false;
  }

}
