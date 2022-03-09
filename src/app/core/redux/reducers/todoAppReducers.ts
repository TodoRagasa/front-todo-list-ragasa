import {ActionReducerMap} from '@ngrx/store';
import * as reducers from './';

export interface IAppState {
  todos: reducers.TodoReducer,
}

export const appReducers: ActionReducerMap<IAppState> = {
  todos: reducers.todoReducer
}
