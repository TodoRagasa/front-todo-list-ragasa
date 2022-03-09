import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";

import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomePage} from './home.page';
import {FormTodoPage} from "./components/form-todo/form-todo.page";
import {TodosPage} from "./components/todos/todos.page";


import {HomePageRoutingModule} from './home-routing.module';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        HomePageRoutingModule
    ],
    declarations: [HomePage, FormTodoPage, TodosPage]
})
export class HomePageModule {
}
