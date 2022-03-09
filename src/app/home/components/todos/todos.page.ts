import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Store} from '@ngrx/store';
import {ModalController} from '@ionic/angular';

import {IAppState} from '../../../core/redux/reducers/todoAppReducers';
import {todoActions} from '../../../core/redux/actions/todo.actions';

import {FormTodoPage} from '../form-todo/form-todo.page';
import {Todo} from '../../../core/models/Todo';
import {AlertService} from '../../../shared/alert.service';
import {TodoService} from '../../../core/services/todos/todo.service';

@Component({
    selector: 'app-todos',
    templateUrl: 'todos.html',
    styleUrls: ['todos.css'],
})
export class TodosPage implements OnInit, OnChanges {

    @Input() isSelectTodos: boolean;
    todosSelected: Todo[] = [];

    @Output() clearTodos: EventEmitter<void> = new EventEmitter<void>();
    @Output() checkTodosSelected = new EventEmitter<number>();
    todos: Todo[] = [];

    constructor(private todoService: TodoService
        , private alertService: AlertService
        , private modalCtrl: ModalController
        , private store: Store<IAppState>
    ) {
        this.todoService.findAll().subscribe(todos => {
            this.store.dispatch(todoActions.retrieveTodos({payload: todos}));
        });
    }

    ngOnInit(): void {
        this.store.select(state => state.todos)
            .subscribe(({todos}) => {
                this.todos = todos;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    async deleteTodo({id}: Todo) {
        const deleteAction = async () => {
            await this.alertService.showLoading('Eliminando todo.');
            this.todoService.delete(id).subscribe(async (todo) => {
                this.store.dispatch(todoActions.deleteTodo({payload: todo}));
                await this.alertService.closeLoading();
            }, async (error) => {
                await this.alertService.closeLoading();
            });
        }
        await this.alertService.showConfirmAlert(deleteAction);
    }

    async editTodo({id, name, description, complete, createdAt, updatedAt}) {
        await this.showModal({id, name, description, complete, createdAt, updatedAt, typeAction: 'update'});
    }

    async completeTodo(todo: Todo) {
        await this.alertService.showLoading('Actualizando todo.');
        this.todoService.update({...todo, complete: true})
            .subscribe(async (resp) => {
                this.store.dispatch(todoActions.updateTodo({payload: resp}));
                await this.alertService.closeLoading();
            }, async () => {
                await this.alertService.closeLoading();
            });

    }

    selectTodo(evt, todo) {
        !evt.target.checked
            ? this.todosSelected.unshift(todo)
            : (() => {
                this.todosSelected = this.todosSelected.length > 0
                    && [...this.todosSelected.filter(item => todo.id !== item.id)];
            })();
        this.checkTodosSelected.emit(this.todosSelected.length);
    }


    async deleteTodosSelected() {
        const deleteTodos = async () => {
            await this.alertService.showLoading('Eliminando todos.');
            this.todoService.deleteTodosBulk(this.todosSelected).subscribe(async (todos) => {
                todos.forEach(todo => this.store.dispatch(todoActions.deleteTodo({payload: todo})));
                await this.clear();
            });
        }
        await this.alertService.showConfirmAlert(deleteTodos, {msj: '¿Deseas eliminar los todos seleccionados?'});
    }

    async updateTodosSelected() {
        const updateTodos = async () => {
            await this.alertService.showLoading('Actualizando todos.');
            this.todoService.updateTodosBulk(this.todosSelected).subscribe(async (todos) => {
                todos.forEach(todo => this.store.dispatch(todoActions.updateTodo({payload: todo})));
                await this.clear();
            });
        }
        await this.alertService.showConfirmAlert(updateTodos, {
            header: 'Actualizar',
            msj: '¿Deseas marcar como completado los todos seleccionados?'
        });
    }

    async clear() {
        await this.alertService.closeLoading();
        this.clearTodos.emit(null);
    }

    async showModal(props = {}) {
        const modal = await this.modalCtrl.create({
            component: FormTodoPage,
            componentProps: {...props}
        });
        return await modal.present();
    }

}
