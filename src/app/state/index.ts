import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

// Selector functions
const getAppState = createFeatureSelector<AppState>('app');

export const getMonthlyViewMode = createSelector(
  getAppState,
  state => state.monthlyViewMode
);

export const getActiveDate = createSelector(
  getAppState,
  state => state.activeDate
);

export const getActiveDateEvents = createSelector(
  getAppState,
  state => state.activeDateEvents
);

export const getActiveMonthEvents = createSelector(
  getAppState,
  state => {
   const activeYear = (state.activeDate).year();
   const activeMonth = (state.activeDate).month();
   if (state.events) {
     if (activeYear in state.events) {
       if (activeMonth in state.events[activeYear]) {
         return state.events[activeYear][activeMonth];
       }
     }
   }
   return null;
  }
);
