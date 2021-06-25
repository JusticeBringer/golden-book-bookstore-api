import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const dotEnvConfig = {
  MONGODB_DB: process.env.MONGODB_DB,
  MONGODB_URI: process.env.MONGODB_URI,
  API_KEY: process.env.API_KEY,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  RESET_MOCKED_DATA: process.env.RESET_MOCKED_DATA,
  SECRET_JWT_TOKEN: process.env.SECRET_JWT_TOKEN as Secret,
  SERVER_DOMAIN_URL: process.env.SERVER_DOMAIN_URL,
  ORIGIN_DOMAIN_URL: process.env.ORIGIN_DOMAIN_URL,
  VALIDATION_EMAIL: process.env.VALIDATION_EMAIL,
  VALIDATION_EMAIL_PASSWORD: process.env.VALIDATION_EMAIL_PASSWORD,
  VALIDATION_EMAIL_SECRET: process.env.VALIDATION_EMAIL_SECRET as Secret,
  MAILGUN_PRIVATE_API_KEY: process.env.MAILGUN_PRIVATE_API_KEY,
  MAILGUN_PUBLIC_VALIDATION_KEY: process.env.MAILGUN_PUBLIC_VALIDATION_KEY,
  MAILGUN_DOMAIN_NAME: process.env.MAILGUN_DOMAIN_NAME
};

export default dotEnvConfig;
