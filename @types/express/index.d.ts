import jwt from 'jsonwebtoken';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      userJwtToken: string | jwt.JwtPayload;
    }
  }
}
