import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListComponent } from './event-list.component';
import { EventComponent } from './event/event.component';
import { AddCategoryComponent } from '../../add-category/add-category.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTimepicker, NgbDatepickerModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { PopupComponent } from '../../popup/popup.component';
import { AddEventComponent } from '../../add-event/add-event.component';
import { provideMockStore } from '@ngrx/store/testing';
import * as moment from 'moment';
describe('EventListComponent', async () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  const initialState = {
    monthlyViewMode: true,
    activeDate: moment().utc(true),
    activeDateEvents: {},
    events: Object.create({})
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule, NgbDatepickerModule],
      declarations: [
        EventListComponent, EventComponent, NgbPopover, PopupComponent,
        NgbTimepicker, AddEventComponent, AddCategoryComponent],
      providers: [provideMockStore({ initialState })]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => { fixture.destroy(); });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
