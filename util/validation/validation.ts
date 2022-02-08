import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../../database/models/user/user.model';
import { IUser, IUserInput } from '../../database/models/user/user.interface';
import { Request, Response, NextFunction } from 'express';
import { dotEnvConfig } from '../../dotenv/config';
import { NodeMailgun } from 'ts-mailgun';

export const registerValidation = (data: any) => {
  const schema = Joi.object<IUserInput>({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });

  return schema.validate(data);
};

export const loginValidation = (data: any) => {
  const schema = Joi.object<IUserInput>({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });

  return schema.validate(data);
};

export const isEmailInDatabase = async (email: string) => {
  const userByEmail: IUser = await UserModel.findOne({ email: email });
  if (!userByEmail) {
    return false;
  }

  return true;
};

export const isVerifiedEmailInDatabase = async (email: string) => {
  const userByEmail: IUser = await UserModel.findOne({ email: email });
  if (!userByEmail) {
    return false;
  }

  if (!userByEmail.isVerifiedEmail) {
    return false;
  }

  return true;
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const passwordCompare = async (reqBodyPassword: string, userDbPassword: string) => {
  return await bcrypt.compare(reqBodyPassword, userDbPassword);
};

export const createJwtToken = (userId: string) => {
  return jwt.sign({ _id: userId }, dotEnvConfig.SECRET_JWT_TOKEN);
};

export const verifyTokenSecret = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  if (token === dotEnvConfig.SECRET_JWT_TOKEN) {
    next();
  } else {
    return res.status(400).send('No token provided. Access denied');
  }
};

export const verifyTokenUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const verifiedToken = jwt.verify(token, dotEnvConfig.SECRET_JWT_TOKEN);
    req.userJwtToken = verifiedToken;
    next();
  } catch (error) {
    return next(error);
  }
};

export async function sendConfirmationEmail(userId: string, userEmail: string) {
  const VALIDATION_EMAIL_SECRET = dotEnvConfig.VALIDATION_EMAIL_SECRET;
  const SERVER_DOMAIN_URL = dotEnvConfig.SERVER_DOMAIN_URL;
  const MAILGUN_PRIVATE_API_KEY = dotEnvConfig.MAILGUN_PRIVATE_API_KEY as string;
  const MAILGUN_DOMAIN_NAME = dotEnvConfig.MAILGUN_DOMAIN_NAME as string;
  const MAILGUN_HOST = dotEnvConfig.MAILGUN_HOST as string;

  const emailToken = jwt.sign(
    {
      userId: userId
    },
    VALIDATION_EMAIL_SECRET,
    {
      expiresIn: '1d'
    }
  );

  const confirmationUrl = SERVER_DOMAIN_URL + `/api/v0/user/register/confirmation/${emailToken}`;

  const data = {
    subject: 'Email confirmation',
    html: `Please click this link for email confirmation: <a href="${confirmationUrl}">${confirmationUrl} </a>`
  };

  const mailer = new NodeMailgun();
  mailer.apiKey = MAILGUN_PRIVATE_API_KEY;
  mailer.domain = MAILGUN_DOMAIN_NAME;
  mailer.options = {
    host: MAILGUN_HOST
  };
  mailer.fromEmail = 'noreply@carteadeaur.games';
  mailer.fromTitle = 'Golden Book Bookstore';
  mailer.init();

  let errorMail = '';
  await mailer
    .send(userEmail, data.subject, data.html)
    .then(() => {})
    .catch((error: any) => {
      errorMail = error.message;
    });

  return errorMail;
}
