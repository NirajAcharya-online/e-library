import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import userRouter from './user/userRouter.js';
import bookRouter from './book/bookRouter.js';
const app = express();
app.use(express.json())

// Routes
app.get('/', (req, res, next) => {
  res.json({
    message: 'Welcome to e-library!',
  });
});
app.use("/api/users",userRouter);
app.use("/api/books" ,bookRouter)
// Global Error Handler
app.use(globalErrorHandler);
export default app;
