export interface IFilterConfig {
    priceFilter?: boolean;
    brandFilter?: boolean;
    discountFilter?: boolean;
    ratingFilter?: boolean;
    sizeFilter?: boolean;
}

export interface IPriceRange {
    index: number;
    min: number;
    max: number;
    displayText: string;
}

export interface IFilterRating {
    minRating: number;
    displayValue: number;
}

export interface IBrand {
    id: number;
    name: string;
}

export interface IFilterObject {
    brandIds: Array<number>;
    priceRange: Array<IPriceRange>;
    rating: Array<number>;
    size: Array<string>;
    discount: Array<number>;
}