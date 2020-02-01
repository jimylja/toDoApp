import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CalendarComponent } from './calendar.component';
import { EventsService } from '../services/events.service';
import { provideMockStore } from '@ngrx/store/testing';
import { MomentDatePipe } from '../moment-date.pipe';
import * as moment from 'moment';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  const initialState = {
    monthlyViewMode: true,
    activeDate: moment().utc(true),
    activeDateEvents: {},
    events: Object.create({})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CalendarComponent, MomentDatePipe],
      providers: [EventsService, provideMockStore({initialState})]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    component.activeDate = initialState.activeDate;
    fixture.detectChanges();
  });

  afterEach(() => { fixture.destroy(); });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
