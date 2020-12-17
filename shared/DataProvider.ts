export interface DataProvider<T> {
    create(value: T): Promise<void>;
    update(value: T): Promise<void>;
    get(id: any): Promise<T>;
    getAll(): Promise<T[]>;
    delete(id: any): Promise<void>;
}