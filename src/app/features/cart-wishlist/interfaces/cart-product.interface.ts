export interface ICartProduct {
    id?: number;
    productId: number;
    productName: string;
    productBrief: string;
    quantity: number;
    userEmail: string;
    unitPrice: number;
    unitCurrency: string;
    cartAddDate: Date;
    cartProductImage: string;
}