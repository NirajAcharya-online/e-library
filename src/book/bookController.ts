import type { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary.js';
import createHttpError from 'http-errors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (
    !files ||
    !files.coverImage ||
    !files.coverImage[0] ||
    !files.file ||
    !files.file[0]
  ) {
    return next(createHttpError(400, 'Cover Image is necessary!'));
  }
  const coverImageFile = files.coverImage[0];
  const coverImageMimeType =
    coverImageFile?.mimetype.split('/').at(-1) ?? 'png';
  const fileName = String(coverImageFile?.filename);
  const filePath = String(coverImageFile?.path);
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-covers',
      format: coverImageMimeType,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while uploading the cover image!'));
  }
  const bookFile = files.file[0];
  const bookFileMimeType = bookFile?.mimetype.split('/').at(-1) ?? 'pdf';
  const bookFileName = String(bookFile?.filename);
  const bookFilePath = String(bookFile?.path);
  try {
    const uploadResult = await cloudinary.uploader.upload(bookFilePath, {
      filename_override: bookFileName,
      folder: 'books',
      format: bookFileMimeType,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while uploading the book!'));
  }
  return res.json({
    message: 'Welcome to the createBook route ',
  });
};
export { createBook };
