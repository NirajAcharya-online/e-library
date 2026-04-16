import mongoose from 'mongoose';
import { config } from './config.js';

const connectDb = async () => {
  try {
    await mongoose.connect(config.databaseUri);
    mongoose.connection.on('connected', () => {
      console.log('Connected to database Successfully!');
    });
    mongoose.connection.on('error', (err) => {
      console.log('Error while connecting to Database!', err);
    });
  } catch (error) {
    console.error(`Failed to connect to database ${error}`);
    process.exit(1);
  }
};
