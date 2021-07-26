import express, { Router, Request, Response } from 'express';
import { IPaymentOrder, IPayment } from '../../../../database/models/payment/payment.interface';
import { PaymentModel } from '../../../../database/models/payment/payment.model';

export const paymentsRouter: Router = express.Router();

paymentsRouter.post('/ramburs', async (req: Request, res: Response): Promise<void> => {
  console.log('req.body.payment is', req.body.payment);

  const payment: IPaymentOrder = req.body.payment;

  let parsedPaymentMethod = payment.paymentMethod as string;
  if (payment.paymentMethod === 'Poștă') {
    parsedPaymentMethod = 'Post';
  }

  const paymentForModel: IPayment = {
    userId: payment.userId,
    status: payment.status,
    amount: payment.amount,
    paymentMethod: parsedPaymentMethod,
    token: payment.token
  };

  const paymentModel = new PaymentModel(paymentForModel);

  try {
    const savedPayment = await paymentModel.save();
    res.status(200).send({ paymentId: savedPayment._id });
  } catch (error) {
    res.status(400).send({ erorr: error });
  }
});

export default paymentsRouter;
