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
    statusPayment: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Cancelled'],
      required: true
    },
    statusDelivery: {
      type: String,
      enum: ['Cancelled', 'Sent', 'Completed', 'In store'],
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
