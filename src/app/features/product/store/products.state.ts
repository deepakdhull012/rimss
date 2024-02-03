import { IProductInfo } from "src/app/shared/interfaces/client/product.interface";


export interface IProductState {
    products: IProductInfo[],
    isLoading: boolean;
}