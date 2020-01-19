import { Action } from '@ngrx/store';

export enum StateActionTypes {
  ToggleViewMode = 'Toggle View Mode'
}

export class ToggleViewMode implements  Action {
  readonly type = StateActionTypes.ToggleViewMode;
  constructor(public payload: boolean) {}
}

export type AppActions = ToggleViewMode;
