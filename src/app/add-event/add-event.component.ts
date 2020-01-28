import {Component, Input, OnInit} from '@angular/core';
import {CategoriesService} from '../services/categories.service';
import {Category} from '../models/category';
import {Event} from '../models/event';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {CreateEvent, UpdateEvent} from '../state/app.actions';
import { AppState } from '../state/app.state';

import * as moment from 'moment';

export interface EventDate {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
}

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private store: Store<AppState>) { }

  @Input() activeDate: moment.Moment;
  @Input() event: Event;
  categories$: Observable<Category[]>;
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
      endDate: [this.event ? this.getDateObj(moment(this.event.endDate)) : this.getDateObj(this.eventEnd), Validators.required],
      startTime: [this.event ? this.getDateObj(moment(this.event.startDate)) : this.getDateObj(this.eventStart)],
      endTime: [this.event ? this.getDateObj(moment(this.event.endDate)) : this.getDateObj(this.eventEnd)],
      category: [this.event ? this.event.category._id : '', Validators.required],
    });
    this.categories$ = this.categoriesService.getCategories();
  }

  onSubmit() {
    const newEvent = this.newEventForm.value;
    newEvent.startDate = this.startEventStr;
    newEvent.endDate = this.endEventStr;
    newEvent.complete = this.event ? this.event.complete : false;
    if (this.event) {
      newEvent._id = this.event._id;
      this.store.dispatch(new UpdateEvent(newEvent));
    } else {
      this.store.dispatch(new CreateEvent(newEvent));
    }
  }

  getDateObj(date: moment.Moment): EventDate {
    return {
      year: date.get('year'),
      month: date.get('month') + 1,
      day: date.get('date'),
      hour: date.get('hour'),
      minute: date.get('minute'),
      second: date.get('second'),
    };
  }

  get startEventStr(): string {
    const {year, month, day} = this.newEventForm.controls.startDate.value;
    const {hour, minute, second} = this.newEventForm.controls.startTime.value;
    const dateObj = moment().set({year, month: month - 1, date: day, hour, minute, second});
    return dateObj.format('YYYY-MM-DD HH:mm:ss');
  }

  get endEventStr(): string {
    const {year, month, day} = this.newEventForm.controls.endDate.value;
    const {hour, minute, second} = this.newEventForm.controls.endTime.value;
    const dateObj = moment().set({year, month: month - 1, date: day, hour, minute, second});
    return dateObj.format('YYYY-MM-DD HH:mm:ss');
  }
}
