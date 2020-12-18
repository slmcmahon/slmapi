import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { PeopleProvider } from "../shared/PeopleProvider";
import { handleRequest, getConfig } from "../shared/RequestHandler";

const peoplefunc: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let peopleProvider = new PeopleProvider(getConfig());
    await handleRequest(context, req, peopleProvider);
};

export default peoplefunc;