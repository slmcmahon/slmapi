import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BookProvider } from '../shared/BookProvider';
import { RequestHandler } from "../shared/RequestHandler";

const bookfunc: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let bookProvider = new BookProvider(RequestHandler.getConfig());
    await RequestHandler.HandleRequest(context, req, bookProvider);
};

export default bookfunc;