import type { Types } from 'mongoose';
import type { IUser } from '../user/userTypes.js';

export interface IBook {
  _id: string;
  title: string;
  author: Types.ObjectId | IUser;
  genere: string;
  coverImage: string;
  file: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
