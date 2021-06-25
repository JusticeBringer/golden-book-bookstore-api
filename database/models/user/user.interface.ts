import { Document } from 'mongoose';

type shippingAddressType = {
  city: string;
  locality: string;
  zipCode: string;
};

export interface IUser {
  email: string;
  password: string;
  isVerifiedEmail: boolean;
  registrationMethod: string;
  familyName?: string;
  givenName?: string;
  phoneNumber?: string;
  firstShippingAddress?: shippingAddressType;
  secondShippingAddress?: shippingAddressType;
  lastSeenAt?: Date;
}

export interface IUserInput {
  email: IUser['email'];
  password: IUser['password'];
}

export interface UserDocument extends IUser, Document {}
