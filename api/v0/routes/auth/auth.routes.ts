import express, { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { UserModel } from '../../../../database/models/user/user.model';
import { IUserInput, IUser } from '../../../../database/models/user/user.interface';

import {
  registerValidation,
  loginValidation,
  isVerifiedEmailInDatabase,
  hashPassword,
  passwordCompare,
  createJwtToken,
  sendConfirmationEmail,
  isEmailInDatabase
} from '../../../../util/validation/validation';
import { dotEnvConfig } from '../../../../dotenv/config';
import jwt from 'jsonwebtoken';

export const authRouter: Router = express.Router();

authRouter.get(
  '/register/confirmation/:token',
  async (req: Request, res: Response): Promise<any> => {
    const VALIDATION_EMAIL_SECRET = dotEnvConfig.VALIDATION_EMAIL_SECRET;
    const loginUrl = dotEnvConfig.ORIGIN_DOMAIN_URL + '/signin';
    const user = jwt.verify(req.params.token, VALIDATION_EMAIL_SECRET) as {
      userId: string;
      iat: number;
      exp: number;
    };

    const userObjectId = mongoose.Types.ObjectId(user.userId);

    await UserModel.updateOne({ _id: userObjectId }, { $set: { isVerifiedEmail: true } }).catch(
      error => {
        res.status(400).send(error);
      }
    );
    res.send(
      `<div style="padding: 5vw"><p style="font-size:5vw;margin-top:2vh"> Email confirmat.</p>  <a href="${loginUrl}" style="font-size:5vw;margin-top:2vh">Spre autentificare. </a></div>`
    );
  }
);

authRouter.post('/register/email', async (req: Request, res: Response): Promise<any> => {
  console.log(req);
  const userFromReqBody = req.body.user;

  const userForValidation: IUserInput = {
    email: userFromReqBody.email,
    password: userFromReqBody.password
  };

  // validating data
  const { error } = registerValidation(userForValidation);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if user is already in database
  const verifiedEmailExists = await isVerifiedEmailInDatabase(userForValidation.email);
  if (verifiedEmailExists) {
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

    // send confirmation email
    await sendConfirmationEmail(savedUser._id, userForValidation.email).catch(error => {
      res.status(400).send(error);
    });

    res.send({ user: savedUser._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post('/register/google', async (req: Request, res: Response): Promise<any> => {
  const userFromReqBody = req.body.user;

  const userForValidation: IUserInput = {
    email: userFromReqBody.email,
    password: userFromReqBody.password
  };

  // validating data
  const { error } = registerValidation(userForValidation);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if user is already in database
  const verifiedEmailExists = await isVerifiedEmailInDatabase(userForValidation.email);
  if (verifiedEmailExists) {
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
  const userFromReqBody = req.body.user;

  const userForValidation: IUserInput = {
    email: userFromReqBody.email,
    password: userFromReqBody.password
  };

  // validating data
  const { error } = loginValidation(userForValidation);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if email is in db
  const emailInDatabase = await isEmailInDatabase(userForValidation.email);

  // check if email is verified
  const verifiedEmailExists = await isVerifiedEmailInDatabase(userForValidation.email);

  if (emailInDatabase && !verifiedEmailExists) {
    return res.status(400).send('Email inexistent sau nu a fost confirmat');
  }

  // get user
  const user = await UserModel.findOne({ email: userForValidation.email });

  // compare passwords
  const validPass = await passwordCompare(userForValidation.password, user.password);

  if (!user || !validPass) {
    return res.status(400).send('Email-ul sau parola sunt incorecte sau contul este inexistent');
  }

  // create and assign a token
  const token = createJwtToken(user._id);
  res.header('auth-token', token).send(token);
});

export default authRouter;
