import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import {map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import * as moment from 'moment';
import {Event} from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get('http://localhost:3000/category').pipe(
      map( (resp: {message: string, data: Category[]}) => resp.data)
    );
  }
}
