import { createSelector } from '@ngrx/store';
import { IAppState, ICoreState } from './app.state';

export const coreState = (state: IAppState) => state.coreState;

export const selectCategories = createSelector(
  coreState,
  (state: ICoreState) => state.categories
);
