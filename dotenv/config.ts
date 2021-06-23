import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const dotEnvConfig = {
  MONGODB_DB: process.env.MONGODB_DB,
  MONGODB_URI: process.env.MONGODB_URI,
  API_KEY: process.env.API_KEY,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
};

export default dotEnvConfig;
