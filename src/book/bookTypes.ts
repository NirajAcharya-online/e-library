import type { IUser } from '../user/userTypes.js';

export interface IBook {
  _id: string;
  title: string;
  author: IUser;
  genere: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
