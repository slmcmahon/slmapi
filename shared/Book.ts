export class Book {
    private _title: string;
    private _isbn: string;

    constructor(isbn: string, title: string) {
        this._isbn = isbn;
        this._title = title;
    }

    public get title(): string {
        return this._title;
    }

    public get isbn(): string {
        return this._isbn;
    }
}