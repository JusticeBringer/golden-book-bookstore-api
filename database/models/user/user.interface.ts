import { Document } from 'mongoose';

type shippingAddressType = {
  city: string;
  locality: string;
  zipCode: string;
};

// type confirmationEmailType = {
//   dateSent: number;
//   dateClicked: number;
// };

export interface IUser {
  email: string;
  password: string;
  isVerifiedEmail: boolean;
  confirmationEmailDateSent: Date;
  confirmationEmailDateClicked: Date;
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

export interface IGoogleUserInput {
  email: string;
}

export interface UserDocument extends IUser, Document {}
