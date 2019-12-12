import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { map } from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';

export enum StoreActions {
  addCategory,
  updateCategory,
  deleteCategory,
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }
  categoriesStorage$ = new BehaviorSubject<Category[]|null>(null);

  /**
   * gets categories from server of from cash
   * @return - array of objects with category data
   */
  getCategories(): Observable<Category[]> {
    const categories = this.categoriesStorage$.value;
    if (categories === null) {
      this.fetchCategories().subscribe(
        resp => this.categoriesStorage$.next(resp)
      );
    }
    return this.categoriesStorage$;
  }

  fetchCategories(): Observable<Category[]> {
    return this.http.get('/category').pipe(
      map( (resp: {message: string, data: Category[]}) => resp.data)
    );
  }

  /**
   * updates category on server
   * @params category - object with updated data
   */
  updateCategory(category: Category): void {
    this.http.put('/category', category).pipe(
      map((resp: {message: string, category: Category}) => {
        return resp.category;
      })
    ).subscribe(
      updatedEvent => this.updateCategoriesStorage(updatedEvent, StoreActions.updateCategory)
    );
  }

  /**
   * delete category on server
   * @params category - object that should be deleted
   */
  deleteCategory(category: Category): void {
    this.updateCategoriesStorage(category, StoreActions.deleteCategory);
    const id = category._id;
    this.http.delete(`/category`, {params: {id}}).subscribe();
  }

  /**
   * create new category on server
   * @params categoryData - object with data for new category
   */
  addCategory(categoryData): void {
    this.http.post(`/category`, categoryData).pipe(
      map((resp: {message: string, category: Category}) => resp.category)
    ).subscribe(
      event => this.updateCategoriesStorage(event, StoreActions.addCategory)
    );
  }

  private updateCategoriesStorage(category: Category, action: StoreActions): void {
    const storageData = this.categoriesStorage$.value;
    switch (action) {
      case StoreActions.updateCategory:
        const index = storageData.findIndex(item => item._id === category._id);
        storageData[index] = category;
        break;
      case StoreActions.deleteCategory:
        const pos = storageData.findIndex(item => item._id === category._id);
        storageData.splice(pos, 1);
        break;
      case StoreActions.addCategory:
      default:
        storageData.unshift(category);
        break;
    }
    this.categoriesStorage$.next(storageData);
  }
}
