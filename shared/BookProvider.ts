import { NVarChar, VarChar } from 'mssql';
import { BaseProvider } from './BaseProvider';
import { Book } from './Book';
import { DataProvider } from './DataProvider';
import { QueryArgs } from './QueryArgs';

const ISBN: string = "isbn";
const Title: string = "title";
const Authors: string = "authors";
const Tags: string = "tags";

const sqlNewBook: string = "insert into Books (isbn, title, authors, tags) values (@isbn, @title, @authors, @tags);";
const sqlGetBook: string = "select isbn, title, authors, tags from books where isbn = @isbn;";
const sqlGetAllBooks: string = "select isbn, title, authors, tags from books;";
const sqlUpdateBook: string = "update books set title = @title, authors = @authors, tags = @tags where isbn = @isbn";
const sqlDeleteBook: string = "delete from books where isbn = @isbn";

export class BookProvider extends BaseProvider implements DataProvider<Book> {
    constructor(dbConfig: any) {
        super(dbConfig);
    }

    private getArgs(value: Book): QueryArgs[] {
        return [
            { name: ISBN, type: VarChar, value: value.isbn },
            { name: Title, type: NVarChar, value: value.title },
            { name: Authors, type: NVarChar, value: value.authors },
            { name: Tags, type: NVarChar, value: value.tags }
        ];
    }

    private getIsbnArg(isbn: string): QueryArgs[] {
        return [
            { name: ISBN, type: VarChar, value: isbn }
        ];
    }

    async create(value: Book): Promise<void> {
        await super.executeQuery(sqlNewBook, this.getArgs(value));
    }

    async update(value: Book): Promise<void> {
        await super.executeQuery(sqlUpdateBook, this.getArgs(value));
    }

    async get(isbn: string): Promise<Book> {
        let records = await super.executeQuery(sqlGetBook, this.getIsbnArg(isbn));
        if (records.length > 0) {
            let rec = records[0];
            return { isbn: rec.isbn, title: rec.title, authors: rec.authors, tags: rec.tags };
        }
        return null;
    }

    async getAll(): Promise<Book[]> {
        let books: Book[] = [];
        let records = await super.executeQuery(sqlGetAllBooks, []);
        records.forEach(r => books.push({ isbn: r.isbn, title: r.title, authors: r.authors, tags: r.tags }));
        return books;
    }

    async delete(isbn: string): Promise<void> {
        await super.executeQuery(sqlDeleteBook, this.getIsbnArg(isbn));
    }
}