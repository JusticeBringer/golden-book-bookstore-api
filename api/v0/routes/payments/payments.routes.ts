import express, { Router, Request, Response } from 'express';
import { IPayment } from '../../../../database/models/payment/payment.interface';
import { PaymentModel } from '../../../../database/models/payment/payment.model';

export const paymentsRouter: Router = express.Router();

paymentsRouter.post('/offline', async (req: Request, res: Response): Promise<void> => {
  console.log('req.body.payment is', req.body.payment);

  const paymentForModel: IPayment = {
    ...req.body.payment
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
