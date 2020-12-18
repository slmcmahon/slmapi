import { Context, HttpRequest } from "@azure/functions"
import { DataProvider } from "./DataProvider";

const handleRequest = async (context: Context, req: HttpRequest, provider: DataProvider<any>) => {
    const id = context.bindingData.id;

    if (req.method === "POST") {
        let value: any = req.body;
        console.log(value);
        try {
            await provider.create(value);
            context.res = {
                status: 204
            };
        } catch (ex) {
            context.res = {
                status: 500,
                body: {
                    message: ex.message
                }
            }
        }
    }
    else if (req.method === "PUT") {
        try {
            let msg: any = req.body;
            await provider.update(msg);
            context.res = {
                status: 204
            }
        } catch (ex) {
            context.res = {
                status: 500,
                body: {
                    message: ex.message
                }
            }
        }
    }
    else if (req.method === "GET") {
        try {
            let result: any;
            if (id) {
                result = await provider.get(id);
            } else {
                result = await provider.getAll();
            }
            if (result !== undefined) {
                context.res = {
                    status: 200,
                    body: JSON.stringify(result, null, 2)
                };
            } else {
                context.res = {
                    status: 400,
                    message: `No records found for id ${id}`
                }
            }
        } catch (ex) {
            context.res = {
                status: 500,
                body: ex.message
            }
        }
    } else if (req.method === "DELETE") {
        try {
            await provider.delete(id);
            context.res = {
                status: 204
            }
        } catch (ex) {
            context.res = {
                status: 500,
                message: ex.message
            }
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

export { handleRequest, getConfig }