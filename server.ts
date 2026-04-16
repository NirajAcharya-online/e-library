import app from './src/app.js';
import { config } from './src/config/config.js';
import connectDb from './src/config/db.js';

const startServer = async () => {
  const port = config.port || 3000;
  await connectDb();
  app.listen(port, () => {
    console.log(`App listing on Port ${port}`);
  });
};
startServer();
