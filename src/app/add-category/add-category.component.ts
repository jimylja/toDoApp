import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { Category } from '../models/category';
import { CategoriesService } from '../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PopupConfig} from '../models/popup';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit, OnChanges {

  constructor(private categoriesService: CategoriesService, private fb: FormBuilder) { }
  newCategoryForm: FormGroup;
  category: Category;
  @Input() popupConfig: PopupConfig;

  ngOnChanges(): void {
    this.category = this.popupConfig.category;
  }

  ngOnInit() {
    this.newCategoryForm = this.fb.group({
      name: [this.category ? this.category.name : '', Validators.required],
      color: [this.category ? this.category.color : '', Validators.required],
      description: [this.category ? this.category.description : '']
    });
  }

  onSubmit(): void {
    const newCategory = this.newCategoryForm.value;
    if (this.category) {
      newCategory._id = this.category._id;
      this.categoriesService.updateCategory(newCategory);
    } else {
      this.categoriesService.addCategory(newCategory);
    }
  }

  deleteCategory(): void {
    const category = this.newCategoryForm.value;
    category._id = this.category._id;
    this.categoriesService.deleteCategory(category);
    this.popupConfig.isOpen = false;
  }
}
