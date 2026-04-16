import mongoose from 'mongoose';
import { config } from './config.js';
import dns from "node:dns";
dns.setServers(["8.8.8.8"]);
const connectDb = async () => {
  try { 
    mongoose.connection.on('connected', () => {
      console.log('Connected to database Successfully!');
    });
    mongoose.connection.on('error', (err) => {
      console.log('Error while connecting to Database!', err);
    });
    await mongoose.connect(config.databaseUri);
  } catch (error) {
    console.error(`Failed to connect to database ${error}`);
    process.exit(1);
  }
};
export default connectDb;