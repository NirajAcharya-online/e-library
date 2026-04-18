import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { User } from './userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import type { IUser } from './userTypes.js';

// For registering User 
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, 'All fields are required!');
    return next(error);
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        'User already exists with this email!'
      );
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, 'Error while getting user!'));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser: IUser;
  try {
    newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, 'Error while ceating user!'));
  }
  try {
    const token = jwt.sign({ sub: newUser._id.toString() }, config.jwtSecret, {
      expiresIn: '7d',
    });
    return res.status(201).json({
      accessToken: token,
      message: 'User registered Sucessfully!',
    });
  } catch (error) {
    return next(createHttpError(500, 'Error while signing token!'));
  }
};

// For logining User 
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = createHttpError(400, 'All fields are required!');
    return next(error);
  }
  let user: IUser | null = null;
  try {
    user = await User.findOne({ email });
    if (!user) {
      const error = createHttpError(404, 'User not fouund!');
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, 'Error while getting the email!'));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(createHttpError(400, 'Username or Password incorrect!'));
  }
  try {
    const token = jwt.sign({ sub: user._id.toString() }, config.jwtSecret, {
      expiresIn: '7d',
    });
    return res.status(200).json({
      accessToken: token,
      message: 'User loggedIn Sucessfully!',
    });
  } catch (error) {
    return next(createHttpError(500, 'Error while login!'));
  }
};
export { createUser, loginUser };
