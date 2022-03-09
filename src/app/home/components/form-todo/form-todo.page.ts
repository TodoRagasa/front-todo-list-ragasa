import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {ModalController} from '@ionic/angular';
import {formatDate} from '@angular/common';

import {Todo} from '../../../core/models/Todo';
import {IAppState} from '../../../core/redux/reducers/todoAppReducers';
import {todoActions} from '../../../core/redux/actions/todo.actions';
import {TodoService} from '../../../core/services/todos/todo.service';
import {AlertService} from '../../../shared/alert.service';

@Component({
    selector: 'form-todo',
    templateUrl: 'form-todo.html',
    styleUrls: ['form-todo.css']
})
export class FormTodoPage implements OnInit {
    // Data passed in by componentProps
    @Input() id: number;
    @Input() name: string;
    @Input() description: string;
    @Input() createdAt: string;
    @Input() updatedAt: string
    @Input() complete: boolean;
    @Input() typeAction: string;

    formTodo: FormGroup;

    constructor(private todoService: TodoService
        , private fb: FormBuilder
        , private alertService: AlertService
        , public modalController: ModalController
        , @Inject(LOCALE_ID) private locale: string
        , private store: Store<IAppState>) {
        this.formTodo = this.fb.group({
            id: [''],
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            createdAt: [''],
            updatedAt: [''],
            complete: [false]
        });
    }

    ngOnInit(): void {
        if (this.typeAction === 'update') {
            const createdAt = formatDate(this.createdAt, 'yyyy-MM-dd h:mm a', this.locale);
            const updatedAt = formatDate(this.updatedAt, 'yyyy-MM-dd h:mm a', this.locale);
            this.formTodo.patchValue({
                id: this.id,
                name: this.name,
                description: this.description,
                complete: this.complete,
                createdAt,
                updatedAt,
            });
        }
    }

    async createNewTodo() {
        const {name, description} = this.formTodo.value;
        const newTodo = new Todo({name, description, complete: false, createdAt: new Date()});
        console.log(newTodo);
        await this.alertService.showLoading('Creando todo');
        this.todoService.add(newTodo).subscribe(async (newTodo) => {
            await this.alertService.closeLoading();
            this.store.dispatch(todoActions.createTodo({payload: newTodo}));
            await this.closeModal();
        }, (error => {
            this.alertService.closeLoading();
        }));
    }

    async updateTodo() {
        const {id, name, description, complete} = this.formTodo.value;
        const updateTodo = new Todo({id, name, description, complete});
        this.todoService.update(updateTodo).subscribe(async todo => {
            this.store.dispatch(todoActions.updateTodo({payload: todo}));
            await this.closeModal();
        })
    }

    async closeModal() {
        return this.modalController.dismiss({
            'dismiss': true
        });
    }

}
