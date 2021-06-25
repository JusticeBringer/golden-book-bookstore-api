import express, { Router, Request, Response } from 'express';
import { UserModel } from '../../../../database/models/user/user.model';
import { IUserInput, IUser } from '../../../../database/models/user/user.interface';

import {
  registerValidation,
  loginValidation,
  emailValidation,
  hashPassword,
  passwordCompare,
  createJwtToken
} from '../../../../util/validation/validation';

export const authRouter: Router = express.Router();

authRouter.post('/register/email', async (req: Request, res: Response): Promise<any> => {
  const userForValidation: IUserInput = {
    email: req.body.email,
    password: req.body.password
  };

  // validating data
  const { error } = registerValidation(userForValidation);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if user is already in database
  const emailExists = await emailValidation(userForValidation.email);
  if (emailExists) {
    return res.status(400).send('Email-ul este deja utilizat');
  }

  // hash password
  const hashedPassword = await hashPassword(userForValidation.password);

  const userForModel: IUser = {
    email: userForValidation.email,
    password: hashedPassword,
    isVerifiedEmail: false,
    registrationMethod: 'email'
  };
  const userModel = new UserModel(userForModel);

  try {
    const savedUser = await userModel.save();
    res.send({ user: savedUser._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post('/register/google', async (req: Request, res: Response): Promise<any> => {
  const userForValidation: IUserInput = {
    email: req.body.email,
    password: req.body.password
  };

  // validating data
  const { error } = registerValidation(userForValidation);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if user is already in database
  const emailExists = await emailValidation(userForValidation.email);
  if (emailExists) {
    return res.status(400).send('Email-ul este deja utilizat');
  }

  // hash password
  const hashedPassword = await hashPassword(userForValidation.password);

  const userForModel: IUser = {
    email: userForValidation.email,
    password: hashedPassword,
    isVerifiedEmail: false,
    registrationMethod: 'email'
  };
  const userModel = new UserModel(userForModel);

  try {
    const savedUser = await userModel.save();
    res.send({ user: savedUser._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post('/login', async (req: Request, res: Response): Promise<any> => {
  const userForValidation: IUserInput = {
    email: req.body.email,
    password: req.body.password
  };

  // validating data
  const { error } = loginValidation(userForValidation);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // get user
  const user = await UserModel.findOne({ email: userForValidation.email });

  // hash password
  const validPass = await passwordCompare(userForValidation.password, user.password);

  if (!user || !validPass) {
    return res.status(400).send('Email-ul sau parola sunt incorecte sau contul este inexistent');
  }

  // create and assign a token
  const token = createJwtToken(user._id);
  res.header('auth-token', token).send(token);
});

export default authRouter;
