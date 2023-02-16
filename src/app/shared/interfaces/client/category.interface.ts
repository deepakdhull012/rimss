export interface ICategory {
    id: string;
    name: string;
    catId: string;
    child?: Array<ICategory>;
}