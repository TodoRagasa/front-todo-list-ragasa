import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Store} from '@ngrx/store';

import {IAppState} from '../core/redux/reducers/todoAppReducers';
import {todoActions} from '../core/redux/actions/todo.actions';

import {FormTodoPage} from './components/form-todo/form-todo.page';
import {TodosPage} from "./components/todos/todos.page";
import {TodoService} from '../core/services/todos/todo.service';
import {Todo} from '../core/models/Todo';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    @ViewChild(TodosPage) todosPage: TodosPage;

    todos: Todo[] = [];
    todosSelected: number = 0;
    isSelectTodos = false;

    constructor(private todoService: TodoService
        , private store: Store<IAppState>
        , public modalCtrl: ModalController) {
        this.todoService.findAll().subscribe(todos => {
            this.store.dispatch(todoActions.retrieveTodos({payload: todos}));
        });
    }

    ngOnInit(): void {
        this.store.select(state => state.todos).subscribe(({todos}) => {
            this.todos = todos;
        });
    }

    async createTodo() {
        const modal = await this.modalCtrl.create({
            component: FormTodoPage,
            componentProps: {typeAction: 'create'}
        });
        return await modal.present();
    }

    selectTodos() {
        this.isSelectTodos = !this.isSelectTodos;
    }

    async deleteTodosSelected() {
        await this.todosPage.deleteTodosSelected();
    }

    async updateTodosSelected() {
        await this.todosPage.updateTodosSelected();
    }

    clear() {
        this.isSelectTodos = false;
        this.todosSelected = 0;
    }

    checkTodosSelected(event) {
        this.todosSelected = event;
    }

}
