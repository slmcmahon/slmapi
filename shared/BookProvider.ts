import { ConnectionPool, IRecordSet, VarChar } from 'mssql';
import { BaseProvider } from './BaseProvider';
import { Book } from './Book';
import { DataProvider } from './DataProvider';
import { QueryArgs } from './QueryArgs';

export class BookProvider extends BaseProvider implements DataProvider<Book> {
    private sqlNewBook : string = "insert into Books (isbn, title) values (@isbn, @title);";
    private sqlGetBook : string = "select isbn, title from books where isbn = @isbn;";
    private sqlGetAllBooks : string = "select isbn, title from books;";
    private sqlUpdateBook : string = "update books set title = @title where isbn = @isbn";
    private sqlDeleteBook : string = "delete from books where isbn = @isbn";

    constructor(dbConfig : any) {
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
        throw new Error('Method not implemented.');
    }

    async get(id: string): Promise<Book> {
        throw new Error('Method not implemented.');
    }

    async getAll(): Promise<Book[]> {
        throw new Error('Method not implemented.');
    }

    async delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}