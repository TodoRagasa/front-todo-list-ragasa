import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {Todo} from "../../models/Todo";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TodoService extends BaseService<Todo> {

    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getResourceUrl(): string {
        return 'todos';
    }

    toServerModel(entity: Todo): Todo {
        return {
            ...entity,
            updatedAt: new Date(),
        }
    }

    updateTodosBulk(todos: Todo[]): Observable<Todo[]> {
        return this.httpClient.put<Todo[]>(`${this.API_URL}/bulk`, todos)
            .pipe(catchError(this.handleError));
    }

    deleteTodosBulk(todos: Todo[]): Observable<Todo[]> {
        return this.httpClient.delete<Todo[]>(`${this.API_URL}`, {body: todos})
            .pipe(catchError(this.handleError));
    }

}
