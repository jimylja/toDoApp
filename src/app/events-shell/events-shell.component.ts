import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-events-shell',
  templateUrl: './events-shell.component.html',
  styleUrls: ['./events-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsShellComponent {
  @Input() monthlyView: boolean;
  @Input() activeDate: moment.Moment;
  constructor() { }
}
