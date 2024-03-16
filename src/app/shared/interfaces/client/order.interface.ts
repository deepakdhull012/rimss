export interface IOrderSummary {
  productOrders: IOrderProduct[];
  originalPrice: number;
  couponCode?: string;
  discountedPrice: number;
  tax: number;
  deliveryCharges: number;
  orderAmount: number;
  couponDiscount?: number;
  fromcart: boolean;
}

export interface IOrder {
  orderId?: number;
  productOrders: IOrderProduct[];
  addressId: number;
  userId: number;
  id?: number | undefined;
  originalPrice: number;
  couponCode?: string;
  discountedPrice: number;
  tax: number;
  deliveryCharges: number;
  orderAmount: number;
  orderDate: Date;
}

export interface IOrderProductUI {
  orderId?: number;
  discountedPrice: number;
  productSummary: string;
  productImage: string;
  orderDate: Date;
  deliveryInfo: IOrderDeliveryInfo;
}


export interface IOrderProduct {
  orderProductId?: number;
  productId: number;
  originalPrice: number;
  discountedPrice: number;
  productSummary: string;
  deliveryInfo: IOrderDeliveryInfo;
  productImage: string;
  qty: number;
}

export interface IOrderDeliveryInfo {
  id?: number;
  orderUpdateEvents: IOrderUpdateEvent[];
}

export interface IOrderUpdateEvent {
  orderStatus: OrderStatus;
  eventDate: Date;
}

export enum OrderStatus {
  PLACED = 'PLACED',
  ACCEPTED = 'ACCEPTED',
  DISPATCHED = 'DISPATCHED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_OF_DELIVERY = 'OUT_OF_DELIVERY',
  DELIVERED = 'DELIVERED',
  PARTIALLY_DELIVERED = 'PARTIALLY_DELIVERED',
  RETURN_APPLIED = 'RETURN_APPLIED',
  RETURN_APPROVED = 'RETURN_APPROVED',
  RETURN_IN_TRANSIT = 'RETURN_IN_TRANSIT',
  RETURN_COMPLETED = 'RETURN_COMPLETED',
}

export interface ICoupon {
  id: 1;
  type: 'flat' | 'percentage';
  amount: number;
  name: string;
  minAmount: number;
  couponLabel?: string;
}
