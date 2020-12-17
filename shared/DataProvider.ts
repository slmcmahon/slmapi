export interface DataProvider<T> {
    create(value: T): Promise<void>;
    update(value: T): Promise<void>;
    get(id: string): Promise<T>;
    getAll(): Promise<T[]>;
    delete(id: string): Promise<void>;
}