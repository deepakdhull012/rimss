export interface IProductServer {
  id: number;
  productName: string;
  mainImage: string;
  productImages?: Array<string>;
  productCategory?: Array<string>;
  productBrief: string;
  productDescription?: string;
  price: number;
  priceAfterDiscount: number;
  currency: string;
  isOnOffer?: boolean;
  priceInfo?: string;
  rating: number;
  discountInPercentage?: number;
  brandId?: number;
  availableColors?: Array<string>;
  sizes?: Array<string>;
  sku?: Array<IProductSKU>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

export interface IProductInfo extends IProductServer{
  isInWishList?: boolean;
  wishListId?: number | null;
  isInCart?: boolean;
}

export interface IFilterCriteria {
  saleId?: number;
  filterString?: string;
  category: Array<string>;
}

export interface IProductSKU {
    color: string;
      size: string;
      units_in_stock: number;
      units_in_order: number;
      units_in_cart: number;
      units_in_wishlist: number;
}
