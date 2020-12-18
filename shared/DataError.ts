export class DataError extends Error {
    public code: number;
    constructor(message: string, code: number) {
        super(message);
        this.name = "DataError";
        this.code = code;
    }
}