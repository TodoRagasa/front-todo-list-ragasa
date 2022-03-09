export class Todo {

    id: string;
    name: string;
    description: string;
    complete: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(todo: Partial<Todo> = {}) {
        Object.assign(this, todo);
    }

    /*constructor({name, description}) {
        this.id = new Date().getTime();
        this.name = name;
        this.description = description;
        this.complete = false;
        this.createdAt = new Date();
    }*/

}
