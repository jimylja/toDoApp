import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar/calendar.component';
import { EventListComponent } from './event-list/event-list.component';
import { FooterComponent } from './footer/footer.component';
import { EventComponent } from './event-list/event/event.component';
import { PopupComponent } from './popup/popup.component';
import { AddEventComponent } from './add-event/add-event.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { NgbDatepickerModule, NgbTimepicker, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';

describe('AppComponent', () => {
  const initialState = {};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, FormsModule, ReactiveFormsModule, NgbDatepickerModule, HttpClientTestingModule
      ],
      declarations: [
        AppComponent, CalendarComponent, EventListComponent, FooterComponent, AddCategoryComponent,
        EventComponent, PopupComponent, AddEventComponent, NgbTimepicker, NgbPopover
      ],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
