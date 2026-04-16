import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import userRouter from './user/userRouter.js';
const app = express();

// Routes
app.get('/', (req, res, next) => {
  res.json({
    message: 'Welcome to e-library!',
  });
});
app.use("/api/users",userRouter);
// Global Error Handler
app.use(globalErrorHandler);
export default app;
