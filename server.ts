import app from './src/app.js';
import {config} from "./src/config/config.js"
const startServer = () => {
  const port =config.port || 3000;
  app.listen(port, () => {
    console.log(`App listing on Port ${port}`);
  });
};
startServer();
