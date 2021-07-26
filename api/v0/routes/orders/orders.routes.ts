import express, { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import { IOrder, OrderDocument } from '../../../../database/models/order/order.interface';
import { BookDocument } from '../../../../database/models/book/book.interface';
import { OrderModel } from '../../../../database/models/order/order.model';
import { BookModel } from '../../../../database/models/book/book.model';
import { getAllOrders } from '../../../../database/services/order.service';
import { verifyTokenSecret } from '../../../../util/validation/validation';

export const ordersRouter: Router = express.Router();

ordersRouter.get('/', verifyTokenSecret, async (req: Request, res: Response): Promise<void> => {
  const { result, errorRet } = await getAllOrders();
  if (!errorRet) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ errorMessage: errorRet });
  }
});

ordersRouter.get('/:id', verifyTokenSecret, async (req: Request, res: Response): Promise<void> => {
  const userObjectId = mongoose.Types.ObjectId(req.params.id);

  const orderInDb: OrderDocument = await OrderModel.findOne({ _id: userObjectId });

  if (!orderInDb) {
    res.status(400).send('Nu există o astfel de comandă');
  } else {
    res.status(200).send(orderInDb);
  }
});

ordersRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const userId = req.body.userId;
  const paymentId = req.body.paymentId;
  const order = req.body.form;

  // get payment by payment id
  // get status

  const orderForModel: IOrder = {
    userId: userId,
    paymentId: paymentId,
    deliveryOption: order.deliveryOption,
    statusPayment: 'unpaid',
    statusDelivery: 'inStore',
    items: order.items,
    shippingAddress: {
      city: order.personalData.city,
      locality: order.personalData.locality,
      street: order.personalData.street,
      zipCode: order.personalData.postalCode
    }
  };
  const orderModel: OrderDocument = new OrderModel(orderForModel);

  try {
    await orderModel.save();

    // update books qtys
    await Promise.all(
      orderModel.items.map(async item => {
        const bookById: BookDocument = await BookModel.findOne({ _id: item.id });
        await BookModel.updateOne(
          { _id: item.id },
          { $set: { quantity: bookById.quantity - item.qty } }
        );
      })
    );

    res.status(200).send({ message: 'Comandă plasată cu succes!' });
  } catch (error) {
    res.status(400).send({ erorr: error });
  }
});

export default ordersRouter;
