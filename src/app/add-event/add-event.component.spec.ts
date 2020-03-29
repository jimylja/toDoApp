import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEventComponent } from './add-event.component';
import { AddCategoryComponent} from '../add-category/add-category.component';
import { PopupComponent } from '../popup/popup.component';
import { EventsService } from '../services/events.service';
import { NgbDatepickerModule, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesService } from '../services/categories.service';
import { FooterComponent } from '../footer/footer.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('AddEventComponent', () => {
  let component: AddEventComponent;
  let fixture: ComponentFixture<AddEventComponent>;
  const initialState = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule, NgbDatepickerModule],
      declarations: [AddEventComponent, NgbTimepicker, PopupComponent, FooterComponent, AddCategoryComponent],
      providers: [EventsService, CategoriesService, provideMockStore({ initialState })]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});