import { Component } from '@angular/core';
import * as moment from 'moment';
import { EventsService } from './services/events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  monthlyView = true;
  activeDate = this.eventService.activeDate$;
  constructor(private eventService: EventsService) { moment.locale('uk'); }
}
