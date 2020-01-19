import { StateActionTypes, AppActions } from './app.actions';
import { AppState } from './app.state';

const initialState: AppState = {
  monthlyViewMode: true
};

export function reducer(state = initialState, action: AppActions): AppState {
  switch (action.type) {
    case StateActionTypes.ToggleViewMode:
      return {
        ...state,
        monthlyViewMode: action.payload
      };
    default:
      return state;
  }
}
