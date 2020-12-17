import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { PeopleProvider } from "../shared/PeopleProvider";
import { RequestHandler } from "../shared/RequestHandler";

const peoplefunc: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let peopleProvider = new PeopleProvider(RequestHandler.getConfig());
    await RequestHandler.HandleRequest(context, req, peopleProvider);
};

export default peoplefunc;