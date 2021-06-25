import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      min: 6,
      max: 255
    },
    isVerifiedEmail: {
      type: Boolean,
      required: true
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024
    },
    familyName: {
      type: String,
      required: false
    },
    givenName: {
      type: String,
      required: false
    },
    phoneNumber: {
      type: String,
      required: false
    },
    firstShippingAddress: {
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
    },
    secondShippingAddress: {
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
    },
    lastSeenAt: {
      type: Date,
      default: new Date(),
      required: false
    },
    registrationMethod: {
      type: String,
      enum: ['google', 'facebook', 'email'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

UserSchema.index({ email: 1 });

export default UserSchema;
