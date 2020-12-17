import { ConnectionPool, IRecordSet, VarChar } from 'mssql';
import { BaseProvider } from './BaseProvider';
import { Book } from './Book';
import { DataProvider } from './DataProvider';
import { QueryArgs } from './QueryArgs';

export class BookProvider extends BaseProvider implements DataProvider<Book> {
    private sqlNewBook: string = "insert into Books (isbn, title) values (@isbn, @title);";
    private sqlGetBook: string = "select isbn, title from books where isbn = @isbn;";
    private sqlGetAllBooks: string = "select isbn, title from books;";
    private sqlUpdateBook: string = "update books set title = @title where isbn = @isbn";
    private sqlDeleteBook: string = "delete from books where isbn = @isbn";

    constructor(dbConfig: any) {
        super(dbConfig);
    }

    async create(value: Book): Promise<void> {
        let args: QueryArgs[] = [
            { name: "isbn", type: VarChar, value: value.isbn },
            { name: "title", type: VarChar, value: value.title }
        ];

        await this.executeQuery(this.sqlNewBook, args);
    }

    async update(value: Book): Promise<void> {
        let args: QueryArgs[] = [
            { name: "isbn", type: VarChar, value: value.isbn },
            { name: "title", type: VarChar, value: value.title }
        ];

        await this.executeQuery(this.sqlUpdateBook, args);
    }

    async get(id: string): Promise<Book> {
        let args: QueryArgs[] = [
            { name: "isbn", type: VarChar, value: id }
        ];
        let records = await this.executeQuery(this.sqlGetBook, args);
        if (records.length > 0) {
            let rec = records[0];
            return new Book(rec.isbn, rec.title);
        }
        return null;
    }

    async getAll(): Promise<Book[]> {
        let books: Book[] = [];
        let records = await this.executeQuery(this.sqlGetAllBooks, []);
        records.forEach(r => books.push(new Book(r.isbn, r.title)));
        return books;
    }

    async delete(id: string): Promise<void> {
        let args: QueryArgs[] = [
            { name: "isbn", type: VarChar, value: id }
        ];
        await this.executeQuery(this.sqlDeleteBook, args);
    }
}