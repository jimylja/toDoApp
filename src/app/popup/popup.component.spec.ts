import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupComponent } from './popup.component';
import { FooterComponent } from '../footer/footer.component';
import { AddEventComponent } from '../add-event/add-event.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTimepicker, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupComponent, AddEventComponent, FooterComponent, NgbTimepicker, AddCategoryComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbDatepickerModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
