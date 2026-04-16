import type { NextFunction, Request, Response } from 'express';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: 'User registered Sucessfully!',
  });
};
export { createUser };
