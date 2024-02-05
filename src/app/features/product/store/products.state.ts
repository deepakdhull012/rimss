import { IProductInfo } from "src/app/shared/interfaces/client/product.interface";
import { IBannerSale } from "../../landing/interfaces/banner-sale.interface";


export interface IProductState {
    products: IProductInfo[],
    isLoading: boolean;
    selectedProduct?: IProductInfo;
    similarProducts?: IProductInfo[];
    recommendedProducts?: IProductInfo[];
    bannerSales: IBannerSale[]
}