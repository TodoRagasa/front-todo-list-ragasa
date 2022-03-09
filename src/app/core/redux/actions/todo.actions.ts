import {createAction, props} from '@ngrx/store';
import * as todoTypes from '../types/todo.types';
import {Todo} from '../../models/Todo';

/**
 * It will execute action to retrieve list of todos
 */
const retrieveTodos = createAction(todoTypes.RETRIEVE_TODOS, props<{ payload: Todo[] }>());

/**
 * It will execute action to create a todo
 */
const createTodo = createAction(todoTypes.CREATE_TODO, props<{ payload: Todo }>());

/**
 * It will execute action to update a todo
 */
const updateTodo = createAction(todoTypes.UPDATE_TODO, props<{ payload: Todo }>());

/**
 * It will execute action to delete a todo
 */
const deleteTodo = createAction(todoTypes.DELETE_TODO, props<{ payload: Todo }>());

export const todoActions = {
  retrieveTodos,
  createTodo,
  updateTodo,
  deleteTodo
}
