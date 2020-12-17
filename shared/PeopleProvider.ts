import { Int, NVarChar } from "mssql";
import { BaseProvider } from "./BaseProvider";
import { DataProvider } from "./DataProvider";
import { Person } from "./Person";
import { QueryArgs } from "./QueryArgs";

const ID: string = "id";
const Surname: string = "surname";
const GivenName: string = "givenName";
const Email: string = "email";

const sqlNewPerson: string = "insert into People (surname, givenName, email) values (@surname, @givenName, @email); select scope_identity() as id;";
const sqlGetPerson: string = "select id, surname, givenName, email from People where id = @id;";
const sqlGetAllPeople: string = "select id, surname, givenName, email from People;";
const sqlUpdatePerson: string = "update People set surname = @surname, givenName = @givenName, email = @email where id = @id";
const sqlDeletePerson: string = "delete from People where id = @id";

export class PeopleProvider extends BaseProvider implements DataProvider<Person> {
    constructor(dbConfig: any) {
        super(dbConfig);
    }

    private getArgs(person: Person): QueryArgs[] {
        return [
            { name: ID, type: Int, value: person.id },
            { name: Surname, type: NVarChar, value: person.surname },
            { name: GivenName, type: NVarChar, value: person.givenName },
            { name: Email, type: NVarChar, value: person.email }
        ];
    }

    private getIdArg(id: number): QueryArgs[] {
        return [
            { name: ID, type: Int, value: id }
        ];
    }

    async create(value: any): Promise<any> {
        let result = await super.executeQuery(sqlNewPerson, this.getArgs(value));
        return result[0].id;
    }

    async update(value: any): Promise<void> {
        await super.executeQuery(sqlUpdatePerson, this.getArgs(value));
    }

    async get(id: any): Promise<any> {
        let records = await super.executeQuery(sqlGetPerson, this.getIdArg(id));
        if (records.length > 0) {
            let rec = records[0];
            return { id: rec.id, surname: rec.surname, givenName: rec.givenName, email: rec.email };
        }
        return null;
    }

    async getAll(): Promise<Person[]> {
        let people: Person[] = [];
        let records = await super.executeQuery(sqlGetAllPeople, []);
        records.forEach(r => people.push({ id: r.id, surname: r.surname, givenName: r.givenName, email: r.email }));
        return people;
    }

    async delete(id: any): Promise<void> {
        await super.executeQuery(sqlDeletePerson, this.getIdArg(id));
    }

}