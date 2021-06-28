import { Document } from 'mongoose';

type shippingAddressType = {
  city: string;
  locality: string;
  street: string;
  zipCode: string;
};

type itemType = {
  id: string;
  qty: number;
};

export interface IOrder {
  userId: string;
  paymentId: string;
  deliveryOption: string;
  status: string;
  items: itemType[];
  shippingAddress: shippingAddressType;
}

interface IOrderInput {
  userId: IOrder['userId'];
  paymentId: IOrder['paymentId'];
  status: IOrder['status'];
  items: IOrder['items'];
  shippingAddress: IOrder['shippingAddress'];
}

export interface OrderInput extends IOrderInput {}
export interface OrderDocument extends IOrder, Document {}
export default OrderDocument;
