import { Component } from '@angular/core';
import {select, Store} from '@ngrx/store';
import {getActiveDate} from '../state';
import {AppState} from '../state/app.state';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private store: Store<AppState>) {}
  popupConfig = {isOpen: false};
  activeDate$ = this.store.pipe(select(getActiveDate));
  showPopup() {
    this.popupConfig = {isOpen: true};
  }
}
