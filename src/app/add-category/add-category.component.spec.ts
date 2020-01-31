import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddCategoryComponent } from './add-category.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgbDatepickerModule, NgbTimepicker} from '@ng-bootstrap/ng-bootstrap';
import {AddEventComponent} from '../add-event/add-event.component';
import {PopupComponent} from '../popup/popup.component';
import {FooterComponent} from '../footer/footer.component';
import {CategoriesService} from '../services/categories.service';

describe('AddCategoryComponent', () => {
  let component: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule, NgbDatepickerModule],
      declarations: [AddCategoryComponent, PopupComponent, FooterComponent, AddEventComponent, NgbTimepicker],
      providers: [CategoriesService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
