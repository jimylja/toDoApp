import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventComponent } from './event.component';
import { PopupComponent } from '../../../popup/popup.component';
import { AddEventComponent } from '../../../add-event/add-event.component';
import { AddCategoryComponent } from '../../../add-category/add-category.component';
import { NgbTimepicker, NgbDatepickerModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  const initialState = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, NgbDatepickerModule],
      declarations: [ EventComponent, NgbPopover, PopupComponent, AddEventComponent, NgbTimepicker, AddCategoryComponent ],
      providers: [provideMockStore({ initialState })]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
