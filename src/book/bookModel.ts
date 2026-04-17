import mongoose from 'mongoose';
import type { IBook } from './bookTypes.js';
import { User } from '../user/userModel.js';
const BookSchema = new mongoose.Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    genere: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const Book = mongoose.model<IBook>('Book', BookSchema);
