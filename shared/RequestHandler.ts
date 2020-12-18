import { Context, HttpRequest } from "@azure/functions"
import { DataError } from "./DataError";
import { DataProvider } from "./DataProvider";

const handleRequest = async (context: Context, req: HttpRequest, provider: DataProvider<any>) => {
    const id = context.bindingData.id;

    switch (req.method) {
        case "POST": {
            try {
                let result = await provider.create(req.body);
                context.res = status(200, result);
            } catch (ex) {
                context.res = handleException(ex);
            }
            break;
        }
        case "PUT": {
            try {
                await provider.update(req.body);
                context.res = status(204);
            } catch (ex) {
                context.res = handleException(ex);
            }
            break;
        }
        case "GET": {
            try {
                let result: any;
                if (id) {
                    result = await provider.get(id);
                } else {
                    result = await provider.getAll();
                }
                context.res = status(200, result);
            } catch (ex) {
                context.res = handleException(ex);
            }
            break;
        }
        case "DELETE": {
            try {
                await provider.delete(id);
                context.res = status(204);
            } catch (ex) {
                context.res = handleException(ex);
            }
            break;
        }
        default: {
            context.res = status(405);
            break;
        }
    }
};

const getConfig = () => {
    return {
        user: process.env.DBUserName,
        password: process.env.DBPassword,
        server: process.env.DBServer,
        database: process.env.DBName
    };
}

const handleException = (ex: any) => {
    // TODO: It is not a good practice to return HTTP status codes from the DataProviders.
    //       This should be refactored so that the management of the data is completely
    //       separate from the REST responses so that we can test these pieces in isolation
    if (ex instanceof DataError) {
        return status(ex.code, ex.message);
    } else {
        return status(500, ex.message);
    }
}

const status = (code: number, message?: string) => {
    let stat: any = {
        status: code
    };
    if (message) {
        stat.body = code === 200 ? message : { message };
    }
    return stat;
}

export { handleRequest, getConfig }