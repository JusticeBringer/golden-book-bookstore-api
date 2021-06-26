import express, { Application } from 'express';
import cors from 'cors';

import { dbDevConnect } from './database/database.development';
import { dbProdConnect } from './database/database.production';
import allApiRoutes from './api/api.routes';
import { dotEnvConfig } from './dotenv/config';
import resetMockedData from './scripts/resetMockedData';

const app: Application = express();

const PORT = dotEnvConfig.PORT || 3000;
const NODE_ENV = dotEnvConfig.NODE_ENV || 'development';
const RESET_MOCKED_DATA = dotEnvConfig.RESET_MOCKED_DATA || 'false';
const ORIGIN_DOMAIN_URL = dotEnvConfig.ORIGIN_DOMAIN_URL || 'http://localhost:3001';

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({ origin: ORIGIN_DOMAIN_URL }));

// Routes
app.use(allApiRoutes);

// Database connection
if (NODE_ENV === 'production') {
  dbProdConnect();
} else {
  dbDevConnect();
}

// Reset mocked data for development
if (NODE_ENV !== 'production') {
  if (RESET_MOCKED_DATA === 'true') {
    (async () => {
      try {
        console.log('Resetting mocked data...');
        await resetMockedData();
      } catch (e) {
        console.error(e);
      }
    })();
  }
}

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error) {
  console.error(`Error occured: ${error.message}`);
}
