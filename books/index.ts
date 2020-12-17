import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Book } from "../shared/Book";
import { BookProvider } from '../shared/BookProvider';

const bookfunc: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    // If an id is passed on the URL string then put it here
    const id = context.bindingData.id;

    // Load the database connection parameters.  If local, then 
    // this will come from the Values section of the local.settings.json file
    const config: any = {
        user: process.env.DBUserName,
        password: process.env.DBPassword,
        server: process.env.DBServer,
        database: process.env.DBName,
        upn: req.headers['x-ms-client-principal-name']
    };

    // create an instance of our controller that will be used in all 
    // request methods
    let controller = new BookProvider(config);

    if (req.method === "POST") {
        let book: Book = req.body;
        console.log(book);
        try {
            let newId = await controller.create(book);
            context.res = {
                status: 200,
                body: {
                    id: newId
                }
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
            await controller.update(msg);
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
            // if (id) {
            //     result = await controller.getSingle(id);
            // } else {
            //     result = await controller.getAll();
            // }
            if (result != null) {
                context.res = {
                    body: JSON.stringify(result, null, 2)
                };
            } else {
                context.res = {
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
            await controller.delete(id);
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

export default bookfunc;