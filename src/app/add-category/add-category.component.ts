import {Component, Input, OnInit} from '@angular/core';
import { Category } from '../models/category';
import { CategoriesService } from '../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import {Event} from '../models/event';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  constructor(private categoriesService: CategoriesService, private fb: FormBuilder) { }
  newCategoryForm: FormGroup;
  @Input() category: Category;


  ngOnInit() {
    this.newCategoryForm = this.fb.group({
      name: [this.category ? this.category.name : '', Validators.required],
      color: [this.category ? this.category.color : '', Validators.required],
      description: [this.category ? this.category.description : '']
    });
  }

  onSubmit() {
    const newCategory = this.newCategoryForm.value;
    if (this.category) {
      newCategory._id = this.category._id;
      // this.eventService.updateEvent(newCategory);
    } else {
      // this.eventService.addEvent(newCategory);
    }
    console.log(newCategory);
  }
}
