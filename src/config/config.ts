import { config as conf } from 'dotenv';
conf();
const _config = {
  port: Number(process.env.PORT),
  databaseUri: String(process.env.MONGO_DB_URI),
  env: String(process.env.NODE_ENV),
  jwtSecret: String(process.env.JWT_SECRET),
  my_cloud_name: String(process.env.MY_CLOUD_NAME),
  api_key: String(process.env.API_KEY),
  api_secret: String(process.env.API_SECRET),
  url: String(process.env.CORS_REQUEST_URL),
};
export const config = Object.freeze(_config);
