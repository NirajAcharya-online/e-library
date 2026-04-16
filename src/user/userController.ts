import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, 'All fields are required!');
    return next(error);
  }
  return res.status(200).json({
    message: 'User registered Sucessfully!',
  });
};
export { createUser };
