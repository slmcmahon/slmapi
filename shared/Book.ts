export class Book {
    public title: string;
    public isbn: string;
    public authors: string;
    public tags: string;

    constructor(isbn: string, title: string, authors: string, tags: string) {
        this.isbn = isbn;
        this.title = title;
        this.authors = authors;
        this.tags = tags;
    }
}