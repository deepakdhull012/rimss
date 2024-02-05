import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICategory } from '../shared/interfaces/client/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private BASE_URL = environment.BASE_API_URL;
  private serviceDestroyed$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  public fetchAllCategories(): Observable<Array<ICategory>> {
    return this.http
      .get<Array<ICategory>>(`${this.BASE_URL}/categories`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }
}
