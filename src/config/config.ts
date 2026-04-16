import { config as conf } from 'dotenv';
conf();
const _config = {
  port: Number(process.env.PORT),
};
export const config = Object.freeze(_config);
