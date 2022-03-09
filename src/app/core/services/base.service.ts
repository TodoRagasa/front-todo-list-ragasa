import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseService<T> {

    public readonly API_URL = environment.baseUrl + this.getResourceUrl();

    protected constructor(protected httpClient: HttpClient) {
    }

    abstract getResourceUrl(): string;

    toServerModel(entity: T) {
        console.log('Entity', entity);
        return entity;
    }

    fromServerModel(json: any): T {
        return json;
    }

    findAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.API_URL}`)
            .pipe(
                map((resp) => resp.map((item) => this.fromServerModel(item))),
                catchError(er => this.handleError(er))
            );
    }

    add(entity: T): Observable<T> {
        return this.httpClient.post<T>(`${this.API_URL}`, this.toServerModel(entity)).pipe(
            catchError(this.handleError)
        )
    }

    update(entity: T): Observable<T> {
        return this.httpClient.put<T>(`${this.API_URL}`, this.toServerModel(entity))
            .pipe(
                catchError(this.handleError)
            )
    }

    delete(id: number | string): Observable<T> {
        return this.httpClient.delete<T>(`${this.API_URL}/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError('Ocurrio un error');
    }


}
