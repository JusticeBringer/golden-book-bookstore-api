import express, { Router, Request, Response } from 'express';
import { IOrder } from '../../../../database/models/order/order.interface';
import { OrderModel } from '../../../../database/models/order/order.model';

export const ordersRouter: Router = express.Router();

ordersRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  console.log('req.body orders is', req.body);
  console.log('req.body.form is', req.body.form);

  const userId = req.body.userId;
  const paymentId = req.body.paymentId;
  const order = req.body.form;

  // get payment by payment id
  // get status

  const orderForModel: IOrder = {
    userId: userId,
    paymentId: paymentId,
    deliveryOption: order.deliveryOption,
    status: 'Unpaid',
    items: order.items,
    shippingAddress: {
      city: order.personalData.city,
      locality: order.personalData.locality,
      street: order.personalData.street,
      zipCode: order.personalData.postalCode
    }
  };
  const orderModel = new OrderModel(orderForModel);

  try {
    await orderModel.save();
    res.status(200).send({ message: 'Comandă plasată cu succes!' });
  } catch (error) {
    res.status(400).send({ erorr: error });
  }
});

export default ordersRouter;
