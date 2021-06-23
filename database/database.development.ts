import { MongoClient } from 'mongodb';
import { dotEnvConfig } from '../dotenv/config';

const MONGODB_URI = dotEnvConfig.MONGODB_URI as string;
const MONGODB_DB = dotEnvConfig.MONGODB_DB as string;

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env');
}

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

export interface Global extends NodeJS.Global {
  document: Document;
  window: Window;
  mongo: any;
}

declare let global: Global;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function dbDevConnect() {
  if (cached.conn) {
    console.log('Existing connection, connected to database');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Connected to development database');
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts)
      .then(client => {
        return {
          client,
          db: client.db(MONGODB_DB)
        };
      })
      .catch(error => console.error(error));
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
