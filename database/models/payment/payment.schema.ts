import { Schema } from 'mongoose';

export const PaymentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'cancelled'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'bankTransfer', 'ramburs', 'post'],
      required: true
    },
    token: {
      type: String,
      required: true
    },
    card: {
      type: {
        brand: {
          type: String,
          required: true
        },
        panLastFour: {
          type: String,
          required: true
        },
        expirationMonth: {
          type: String,
          required: true
        },
        expirationYear: {
          type: String,
          required: true
        }
      },
      required: false
    }
  },
  {
    timestamps: true
  }
);

export default PaymentSchema;
