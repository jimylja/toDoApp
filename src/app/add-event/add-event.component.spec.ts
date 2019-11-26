import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AddEventComponent } from './add-event.component';
import { PopupComponent } from '../popup/popup.component';
import { EventsService } from '../services/events.service';
import { NgbDatepickerModule, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesService } from '../services/categories.service';
import { FooterComponent } from '../footer/footer.component';

describe('AddEventComponent', () => {
  let component: AddEventComponent;
  let fixture: ComponentFixture<AddEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule, NgbDatepickerModule],
      declarations: [AddEventComponent, NgbTimepicker, PopupComponent, FooterComponent],
      providers: [EventsService, CategoriesService]
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
