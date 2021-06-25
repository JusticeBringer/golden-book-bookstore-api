import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../../database/models/user/user.model';
import { IUserInput } from '../../database/models/user/user.interface';
import { Request, Response, NextFunction } from 'express';
import { dotEnvConfig } from '../../dotenv/config';

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

export const emailValidation = async (email: string) => {
  return await UserModel.findOne({ email: email });
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
