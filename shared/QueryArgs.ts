import { ISqlTypeFactoryWithNoParams } from "mssql";

export interface QueryArgs {
  name: string;
  value: any;
  type: ISqlTypeFactoryWithNoParams;
}
