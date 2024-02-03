import { IProductState } from "src/app/features/product/store/products.state";

export interface IAppState {
    products: IProductState;
}