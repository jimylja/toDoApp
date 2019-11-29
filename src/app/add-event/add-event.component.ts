import {Component, Input, OnInit} from '@angular/core';
import {CategoriesService} from '../services/categories.service';
import {EventsService} from '../services/events.service';
import {Category} from '../models/category';
import {Event} from '../models/event';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import * as moment from 'moment';

export interface EventDate {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  dateStr: string;
}

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  constructor(private categoriesService: CategoriesService, private eventService: EventsService, private fb: FormBuilder) { }

  @Input() event: Event;
  categories$: Observable<Category[]>;
  activeDate = this.eventService.activeDate$.value;
  newEventForm: FormGroup;

  get eventStart(): moment.Moment {
    return this.activeDate.clone().set({hour: moment().get('hour'), minute: moment().get('minute')});
  }

  get eventEnd(): moment.Moment {
    return this.eventStart.add(1, 'hours');
  }

  ngOnInit() {
    this.newEventForm = this.fb.group({
      title: [this.event ? this.event.title : '', Validators.required],
      description: [this.event ? this.event.description : '', Validators.required],
      startDate: [this.event ? this.getDateObj(moment(this.event.startDate)) : this.getDateObj(this.eventStart), Validators.required],
      endDate: [this.event ? this.getDateObj(moment(this.event.startDate)) : this.getDateObj(this.eventEnd), Validators.required],
      startTime: [this.event ? this.getDateObj(moment(this.event.startDate)) : this.getDateObj(this.eventStart)],
      endTime: [this.event ? this.getDateObj(moment(this.event.startDate)) : this.getDateObj(this.eventEnd)],
      category: [this.event ? this.event.category._id : ''],
      _id: [this.event ? this.event._id : '']
    });
    this.categories$ = this.categoriesService.getCategories();
  }

  onSubmit() {
    const newEvent = this.newEventForm.value;
    newEvent.startDate = newEvent.startDate.dateStr;
    newEvent.endDate = newEvent.endDate.dateStr;
    newEvent.complete = this.event ? this.event.complete : false;
    if (this.event) {
      this.eventService.updateEvent(newEvent);
    } else {
      this.eventService.addEvent(newEvent);
    }
  }

  getDateObj(date: moment.Moment): EventDate {
    return {
      year: date.get('year'),
      month: date.get('month'),
      day: date.get('date'),
      hour: date.get('hour'),
      minute: date.get('minute'),
      second: date.get('second'),
      dateStr: date.format('YYYY-MM-DD HH:mm:ss')
    };
  }
}
