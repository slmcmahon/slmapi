import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BookProvider } from '../shared/BookProvider';
import { handleRequest, getConfig } from "../shared/RequestHandler";

const bookfunc: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let bookProvider = new BookProvider(getConfig());
    await handleRequest(context, req, bookProvider);
};

export default bookfunc;