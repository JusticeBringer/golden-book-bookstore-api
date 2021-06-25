import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../../database/models/user/user.model';
import { IUser, IUserInput } from '../../database/models/user/user.interface';
import { Request, Response, NextFunction } from 'express';
import { dotEnvConfig } from '../../dotenv/config';
import mailgun from 'mailgun-js';

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

export const sendConfirmationEmail = async (userId: string, userEmail: string) => {
  const VALIDATION_EMAIL_SECRET = dotEnvConfig.VALIDATION_EMAIL_SECRET;
  const SERVER_DOMAIN_URL = dotEnvConfig.SERVER_DOMAIN_URL;
  const VALIDATION_EMAIL = dotEnvConfig.VALIDATION_EMAIL;
  const MAILGUN_PRIVATE_API_KEY = dotEnvConfig.MAILGUN_PRIVATE_API_KEY;
  const MAILGUN_DOMAIN_NAME = dotEnvConfig.MAILGUN_DOMAIN_NAME;

  console.log('Sending email confirmation...');

  let mg = new mailgun({ apiKey: MAILGUN_PRIVATE_API_KEY, domain: MAILGUN_DOMAIN_NAME });

  jwt.sign(
    {
      userId: userId
    },
    VALIDATION_EMAIL_SECRET,
    {
      expiresIn: '1d'
    },
    (error, emailToken) => {
      const confirmationUrl =
        SERVER_DOMAIN_URL + `/api/v0/user/register/confirmation/${emailToken}`;

      let data = {
        from: `Cartea de Aur <${VALIDATION_EMAIL}>`,
        to: userEmail,
        subject: 'Email confirmation',
        html: `Vă rugăm accesați următorul link pentru confirmarea email-ului: <a href="${confirmationUrl}">${confirmationUrl} </a>`
      };

      mg.messages().send(data, function (err, body) {
        if (err) {
          throw new Error(err);
        } else {
          console.log('sent email confirmation.');
          console.log({ body });
        }
      });
    }
  );
};
