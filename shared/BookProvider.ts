import { NVarChar, VarChar } from 'mssql';
import { BaseProvider } from './BaseProvider';
import { Book } from './Book';
import { DataError } from './DataError';
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

    private getArgs(book: Book): QueryArgs[] {
        return [
            { name: ISBN, type: VarChar, value: book.isbn },
            { name: Title, type: NVarChar, value: book.title },
            { name: Authors, type: NVarChar, value: book.authors },
            { name: Tags, type: NVarChar, value: book.tags }
        ];
    }

    private getIsbnArg(isbn: string): QueryArgs[] {
        return [
            { name: ISBN, type: VarChar, value: isbn }
        ];
    }

    async create(book: Book): Promise<any> {
        try {
            await super.executeQuery(sqlNewBook, this.getArgs(book));
            return book;
        } catch (ex) {
            if (ex.number === 2627) {
                throw new DataError('A record already exists for the provided id', 409);
            } else {
                throw (ex);
            }
        }
    }

    async update(book: Book): Promise<void> {
        // this will just check to see if a record exists.  If not, then it 
        // will throw an exception that indicates that the record does not exist
        await this.get(book.isbn);

        // if we got this far, then the record exists, so update it.
        await super.executeQuery(sqlUpdateBook, this.getArgs(book));
    }

    async get(isbn: string): Promise<Book> {
        let records = await super.executeQuery(sqlGetBook, this.getIsbnArg(isbn));
        if (records.length > 0) {
            let rec = records[0];
            return { isbn: rec.isbn, title: rec.title, authors: rec.authors, tags: rec.tags };
        } else {
            throw new DataError('No record exists for the provided id', 404);
        }
    }

    async getAll(): Promise<Book[]> {
        let books: Book[] = [];
        let records = await super.executeQuery(sqlGetAllBooks, []);
        records.forEach(r => books.push({ isbn: r.isbn, title: r.title, authors: r.authors, tags: r.tags }));
        return books;
    }

    async delete(isbn: string): Promise<void> {
        await this.get(isbn);
        await super.executeQuery(sqlDeleteBook, this.getIsbnArg(isbn));
    }
}