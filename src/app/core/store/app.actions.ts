import { createAction, props } from '@ngrx/store';
import { ICategory } from 'src/app/shared/interfaces/client/category.interface';

export const fetchCategories = createAction(
  '[Product/API] Fetch Categories'
);

export const loadCategories = createAction(
  '[Product/API] Load Categories',
  props<{ categories: ICategory[] }>()
);
