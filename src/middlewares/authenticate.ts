import { type NextFunction, type Request, type Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Authorization Token is required!'));
  }

  try {
    const parsedToken = token.split(' ')[1] as string;

    const decoded = jwt.verify(parsedToken, config.jwtSecret as string) as {
      sub: string;
    };

    (req as AuthRequest).userId = decoded.sub;
    next();
  } catch (err) {
    return next(createHttpError(401, 'Token expired or invalid!'));
  }
};

export default authenticate;
