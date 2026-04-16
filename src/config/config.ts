import { config as conf } from 'dotenv';
conf();
const _config = {
  port: Number(process.env.PORT),
  databaseUri: String(process.env.MONGO_DB_URI),
  env: String(process.env.NODE_ENV),
};
export const config = Object.freeze(_config);
