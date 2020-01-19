import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

// Selector functions
const getAppState = createFeatureSelector<AppState>('app');

export const getMonthlyViewMode = createSelector(
  getAppState,
  state => state.monthlyViewMode
);

