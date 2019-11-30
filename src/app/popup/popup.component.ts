import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { openCloseAnimation, openCloseShadeAnimation } from './animation';
import { PopupConfig } from '../models/popup';

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
export class PopupComponent {

  constructor() { }
  @Input() popupConfig: PopupConfig;

  closePopup() {
    this.popupConfig.isOpen = false;
  }

}
