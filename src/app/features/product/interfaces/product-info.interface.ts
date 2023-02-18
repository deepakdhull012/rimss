export interface IProductInfoConfig {
    displayFavouriteIcon?: boolean;
    displayNewIcon?: boolean;
}

export enum SortBy {
    PRICE_LOW_TO_HIGH = "PRICE_LOW_TO_HIGH",
    PRICE_HIGH_TO_LOW = "PRICE_HIGH_TO_LOW",
    HIGH_RATED = "HIGH_RATED"
}

export enum IProductDetailsTab {
    SPECIFICATION = "SPECIFICATION",
    WARRANTY = "WARRANTY",
    SHIPPING = "SHIPPING",
    SELLER = "SELLER"

}