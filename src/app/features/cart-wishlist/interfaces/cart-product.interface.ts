export interface ICartProduct {
    id?: number;
    productId: number;
    productName: string;
    productBrief: string;
    quantity: number;
    userEmail: string;
    unitPrice: number;
    unitCurrency: string;
    discountedPrice: number;
    cartAddDate: Date;
    cartProductImage: string;
}