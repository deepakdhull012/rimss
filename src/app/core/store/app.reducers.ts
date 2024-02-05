import { createReducer, on } from '@ngrx/store';
import { ICoreState } from './app.state';
import * as RootActions from './app.actions';

export const intialAppState: ICoreState = {
  categories: []
};
export const coreFeatureKey = 'coreState';

export const coreReducer = createReducer(
  intialAppState,
  on(RootActions.loadCategories, (state, payload) => {
    console.log('load categories', payload);
    return { ...state, categories: payload.categories };
  })
);
