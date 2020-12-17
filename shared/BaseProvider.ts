import {
    ConnectionPool,
    IRecordSet,
    VarChar,
} from "mssql";

import { QueryArgs } from "./QueryArgs";

export class BaseProvider {
    private _dbConfig: any;

    public constructor(dbConfig: any) {
        this._dbConfig = dbConfig;
    }

    protected async executeQuery(
        query: string,
        args: QueryArgs[]
    ): Promise<IRecordSet<any>> {
        let pool = await new ConnectionPool(this._dbConfig).connect();
        let request = pool.request();
        args.forEach((a) => request.input(a.name, a.type, a.value));
        let result = await request.query(query);
        pool.close();
        return await Promise.resolve(result.recordset);
    }
}