import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { PopupComponent } from '../popup/popup.component';
import { AddEventComponent } from '../add-event/add-event.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTimepicker, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  const initialState = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, NgbDatepickerModule],
      declarations: [ FooterComponent, PopupComponent, AddEventComponent, NgbTimepicker, AddCategoryComponent ],
      providers: [provideMockStore({ initialState })]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
