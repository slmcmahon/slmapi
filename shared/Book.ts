export class Book {
    public title: string;
    public isbn: string;

    constructor(isbn: string, title: string) {
        this.isbn = isbn;
        this.title = title;
    }
}