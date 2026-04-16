import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
const app = express();

// Routes
app.get('/', (req, res, next) => {
  res.json({
    message: 'Welcome to e-library!',
  });
});

// Global Error Handler
app.use(globalErrorHandler);
export default app;
