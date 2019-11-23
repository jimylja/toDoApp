import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  constructor( private  categoriesService: CategoriesService, private fb: FormBuilder) { }
  newEventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    category: ['']
  });
  categories$: Observable<Category[]>;

  ngOnInit() {
    this.categories$ = this.categoriesService.getCategories().pipe(
      tap(data => {
        this.newEventForm.patchValue({category: data[0]._id});
      })
    );
  }

  onSubmit() {
    console.log(this.newEventForm.value);
  }

}
