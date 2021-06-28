import { Schema } from 'mongoose';

const itemsSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  }
});

export const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    paymentId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Cancelled', 'Sent', 'Completed'],
      required: true
    },
    items: [itemsSchema],
    shippingAddress: {
      type: {
        city: {
          type: String,
          required: true
        },
        locality: {
          type: String,
          required: true
        },
        zipCode: {
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

export default OrderSchema;
