import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { EventsService } from '../services/events.service';
import { Category } from '../models/category';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import {tap} from 'rxjs/operators';

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

  constructor( private categoriesService: CategoriesService, private eventService: EventsService, private fb: FormBuilder) { }
  activeDate = this.eventService.activeDate$.value;

  newEventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    startDate: [this.getDateObj(this.eventStart), Validators.required],
    endDate: [this.getDateObj(this.eventEnd), Validators.required],
    startTime: [this.getDateObj(this.eventStart)],
    endTime: [this.getDateObj(this.eventEnd)],
    category: ['']
  });
  categories$: Observable<Category[]>;

  get eventStart(): moment.Moment {
    return this.activeDate.set({hour: moment().get('hour'), minute: moment().get('minute')});
  }

  get eventEnd(): moment.Moment {
    return this.eventStart.add(1, 'hours');
  }

  ngOnInit() {
    this.categories$ = this.categoriesService.getCategories().pipe(
      tap(data => {
        this.newEventForm.patchValue({category: data[0]._id});
      })
    );
  }

  onSubmit() {
    this.eventService.addEvent(this.newEventForm.value);
  }

  private getDateObj(date: moment.Moment): EventDate {
    return {
      year: date.get('year'),
      month: date.get('month'),
      day: date.get('date'),
      hour: date.get('hour'),
      minute: date.get('minute'),
      second: date.get('second')
    };
  }
}
