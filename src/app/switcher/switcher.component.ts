import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitcherComponent {
  @Input() monthlyView: boolean;
  @Output() viewChanged = new EventEmitter<boolean>();
  constructor() { }

  changeView(isMonthlyView: boolean): void {
    this.viewChanged.emit(isMonthlyView);
  }
}
