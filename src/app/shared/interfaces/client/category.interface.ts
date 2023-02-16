export interface ICategory {
    id: string;
    name: string;
    child?: Array<ICategory>;
}