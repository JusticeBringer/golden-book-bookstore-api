import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { UserModel } from '../../../../database/models/user/user.model';
import {
  UserDocument,
  IUserInput,
  IUser,
  IGoogleUserInput
} from '../../../../database/models/user/user.interface';

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
import { isDatePastoneDayAgo } from '../../../../util/helpers';

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

    const userInDb: UserDocument = await UserModel.findOne({ _id: userObjectId });
    if (!userInDb) {
      return res.status(400).send(
        `<body>
          <div style="padding: 5vw">
            <p style="font-size:5vw;"> Link-ul de confirmare este invalid. </p>
            <p style="font-size:4vw;margin-top:2vh"> Dacă aveți deja un cont, mergeți </p> 
            <a style="font-size:4vw;" href="${loginUrl}"> spre autentificare </a>
          </div> 
        </body>`
      );
    }

    if (userInDb.isVerifiedEmail) {
      return res.send(
        `<body>
          <div style="padding: 5vw">
            <p style="font-size:5vw;margin-top:2vh"> Email-ul a fost deja confirmat.</p> 
            <a style="font-size:5vw;" href="${loginUrl}"> Spre autentificare </a>
          </div> 
        </body>`
      );
    }

    await UserModel.updateOne({ _id: userObjectId }, { $set: { isVerifiedEmail: true } }).catch(
      error => {
        return res.status(400).send(error);
      }
    );
    return res.send(
      `<body onload=window.location.href='${loginUrl}'>
        <div style="padding: 5vw">
          <p style="font-size:5vw;margin-top:2vh"> Email confirmat.</p> 
        <div style="font-size:4vw;margin-top:2vh">
          <p> Veți fi redirecționat automat imediat spre autentificare. Dacă nu, apăsați <a href="${loginUrl}"> aici </a> </p>
        </div>
        </div> 
      </body>`
    );
  }
);

authRouter.post('/register/email', async (req: Request, res: Response): Promise<any> => {
  console.log('req is: ', req);
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

  // check if verified email is already in database
  const verifiedEmailExists = await isVerifiedEmailInDatabase(userForValidation.email);
  if (verifiedEmailExists) {
    return res.status(400).send('Email-ul este deja utilizat');
  }

  // check if mail was sent already
  const emailInDatabase = await isEmailInDatabase(userForValidation.email);

  // if email is in database resend confirmation email, if needed
  if (emailInDatabase) {
    // get user by email
    let user: UserDocument = await UserModel.findOne({ email: userForValidation.email });

    // if confirmation email < 24 hours -> wait for 24 hours to finish
    if (!isDatePastoneDayAgo(user.confirmationEmailDateSent as Date)) {
      return res
        .status(400)
        .send(
          'A fost trimis deja un email pentru confirmare. Pentru retrimiterea email-ului de confirmare încercați din nou peste 24 de ore.'
        );
    } else {
      // resend email
      const errorMail = await sendConfirmationEmail(user._id, user.email);
      if (errorMail) {
        return res
          .status(400)
          .send(
            'Nu s-a putut trimite email la adresa specificată. Încercați mai târziu sau folosiți o altă adresă de email.'
          );
      }

      // update in db
      await UserModel.updateOne(
        { _id: user._id },
        { $set: { confirmationEmailDateSent: Date.now() } }
      ).catch(error => {
        return res.status(400).send({ error: error });
      });

      return res.status(200).send('A fost trimis un alt email de confirmare');
    }
  }

  // hash password
  const hashedPassword = await hashPassword(userForValidation.password);

  const userForModel: IUser = {
    email: userForValidation.email,
    password: hashedPassword,
    isVerifiedEmail: false,
    registrationMethod: 'email',
    confirmationEmailDateSent: new Date()
  };

  let userModel: UserDocument = new UserModel(userForModel);

  const errorMail = await sendConfirmationEmail(userModel._id, userForValidation.email);
  if (errorMail) {
    return res
      .status(400)
      .send(
        'Nu s-a putut trimite email la adresa specificată. Încercați mai târziu sau folosiți o altă adresă de email.'
      );
  }

  // else, everything worked good

  await userModel
    .save()
    .then((user: UserDocument) => {
      return res.status(200).send({ userId: user._id });
    })
    .catch((error: any) => {
      return res.status(400).send(error);
    });
});

authRouter.post('/register/google', async (req: Request, res: Response): Promise<any> => {
  const userFromReqBody = req.body.user;

  const userForValidation: IGoogleUserInput = {
    email: userFromReqBody.email
  };

  // check if user is already in database
  const verifiedEmailExists = await isVerifiedEmailInDatabase(userForValidation.email);
  if (verifiedEmailExists) {
    return res.status(400).send('Email-ul este deja utilizat');
  }

  // hashed password of email
  const hashedPassword = await hashPassword(userForValidation.email);

  const userForModel: IUser = {
    email: userForValidation.email,
    password: hashedPassword,
    isVerifiedEmail: true,
    registrationMethod: 'google',
    confirmationEmailDateSent: new Date(),
    confirmationEmailDateClicked: new Date()
  };
  const userModel = new UserModel(userForModel);

  try {
    const savedUser = await userModel.save();

    // create and assign a token
    const token = createJwtToken(savedUser._id);
    res.header('auth-token', token).send({ token: token, userId: savedUser._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post('/login/email', async (req: Request, res: Response): Promise<any> => {
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

  if (!user) {
    return res.status(400).send('Email-ul sau parola sunt incorecte sau contul este inexistent');
  }

  // compare passwords
  const validPass = await passwordCompare(userForValidation.password, user.password);

  if (!validPass) {
    return res.status(400).send('Email-ul sau parola sunt incorecte sau contul este inexistent');
  }

  // create and assign a token
  const token = createJwtToken(user._id);
  res.header('auth-token', token).send({ token: token, userId: user._id });
});

authRouter.post('/login/google', async (req: Request, res: Response): Promise<any> => {
  const userFromReqBody = req.body.user;

  const userForValidation: IGoogleUserInput = {
    email: userFromReqBody.email
  };

  // check if email is verified
  const verifiedEmailExists = await isVerifiedEmailInDatabase(userForValidation.email);

  if (!verifiedEmailExists) {
    return res.status(400).send('Email inexistent sau nu a fost confirmat');
  }

  // get user
  const user: UserDocument = await UserModel.findOne({ email: userForValidation.email });

  if (!user) {
    return res.status(400).send('Email-ul sau parola sunt incorecte sau contul este inexistent');
  }

  if (user.registrationMethod !== 'google') {
    return res.status(400).send('Email-ul sau parola sunt incorecte sau contul este inexistent');
  }

  // create and assign a token
  const token = createJwtToken(user._id);
  res.header('auth-token', token).send({ token: token, userId: user._id });
});

export default authRouter;
