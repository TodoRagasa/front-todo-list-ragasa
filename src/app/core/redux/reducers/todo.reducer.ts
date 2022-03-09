import {Action, createReducer, on} from '@ngrx/store';
import {todoActions} from '../actions/todo.actions';
import {Todo} from "../../models/Todo";

export interface TodoReducer {
    todos: Todo[];
    load: boolean;
}

export const initState: TodoReducer = {
    todos: [],
    load: false
};

const _todoReducer = createReducer(initState,
    on(todoActions.retrieveTodos, (state, action) => ({
        ...state,
        todos: [...action.payload],
        load: true
    })),
    on(todoActions.createTodo, (state, action) => ({
        ...state, todos: [action.payload, ...state.todos]
    })),
    on(todoActions.updateTodo, (state, action) => ({
        ...state,
        todos: [...state.todos.map(todo => todo.id === action.payload.id ? action.payload : todo)]
    })),
    on(todoActions.deleteTodo, (state, action) => ({
        ...state,
        todos: [...state.todos.filter(todo => todo.id !== action.payload.id)]
    }))
)

export function todoReducer(state: TodoReducer, action: Action) {
    return _todoReducer(state, action);
}
