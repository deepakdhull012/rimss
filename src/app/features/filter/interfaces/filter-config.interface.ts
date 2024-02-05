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
    selectedBrands: number[];
    selectedPriceRanges: IPriceRange[];
    selectedDiscountRanges: number[];
    selectedSizes: string[];
    selectedRating: number[];
}