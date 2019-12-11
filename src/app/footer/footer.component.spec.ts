import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { PopupComponent } from '../popup/popup.component';
import { AddEventComponent } from '../add-event/add-event.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTimepicker, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, NgbDatepickerModule],
      declarations: [ FooterComponent, PopupComponent, AddEventComponent, NgbTimepicker, AddCategoryComponent ]
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
