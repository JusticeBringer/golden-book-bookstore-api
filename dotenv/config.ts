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
  SECRET_JWT_TOKEN: process.env.SECRET_JWT_TOKEN as Secret
};

export default dotEnvConfig;
