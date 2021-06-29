import { FilterQuery } from 'mongoose';
import { OrderDocument } from '../models/order/order.interface';
import Orders from '../models/order/order.model';

export async function findOrder(query: FilterQuery<OrderDocument>, options: any = { lean: true }) {
  return Orders.findOne(query, null, options);
}

export async function deleteAllOrders() {
  return Orders.deleteMany({});
}

export async function getAllOrders() {
  let errorRet: string = '';
  const result: OrderDocument[] | void = await Orders.find()
    .exec()
    .then()
    .catch(error => {
      errorRet = error;
    });
  return { result, errorRet };
}
