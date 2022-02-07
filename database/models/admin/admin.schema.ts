import { Schema } from 'mongoose';

export const AdminSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    secondPassword: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['root', 'admin', 'viewer'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

AdminSchema.index({ email: 1 });

export default AdminSchema;
