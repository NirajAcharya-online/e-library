import type { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary.js';
import createHttpError from 'http-errors';
import { Book } from './bookModel.js';
import { deleteLocalFile } from '../utils/fileRemover.js';
import type { IBook } from './bookTypes.js';
import { Types } from 'mongoose';
import type { AuthRequest } from '../middlewares/authenticate.js';
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  // Setup for handling the typescript error
  const _req = req as AuthRequest;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Extracting data given by the client!
  const { title, genere } = req.body;
  const authorId = _req.userId;
  const coverImageFile = files?.coverImage?.[0];
  const bookFile = files?.file?.[0];

  if (!coverImageFile || !bookFile) {
    return next(createHttpError(400, 'Cover Image is necessary!'));
  }

  try {
    // Extracting details of coverImage for cloudinary
    const coverImageMimeType =
      coverImageFile?.mimetype.split('/').at(-1) ?? 'png';
    const fileName = String(coverImageFile?.filename);
    const filePath = String(coverImageFile?.path);

    // Uploading cover Image in clodinary!!
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-covers',
      format: coverImageMimeType,
    });

    // Extacting details of book for cloudinary
    const bookFileMimeType = bookFile?.mimetype.split('/').at(-1) ?? 'pdf';
    const bookFileName = String(bookFile?.filename);
    const bookFilePath = String(bookFile?.path);

    // Uploading bookfile in clodinary
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: 'raw',
        filename_override: bookFileName,
        folder: 'book-pdf',
        format: bookFileMimeType,
      }
    );

    // Uploading cloudinary url and userdata to database
    let newBook: IBook;
    try {
      newBook = await Book.create({
        title,
        genere,
        author: new Types.ObjectId('69e1a77f65323ea5482b0736'),
        coverImage: uploadResult.secure_url,
        file: bookFileUploadResult.secure_url,
      });
    } catch (error) {
      return next(
        createHttpError(500, 'Error while uploading to the database ')
      );
    }

    // Detete temp files from the server
    await deleteLocalFile(filePath);
    await deleteLocalFile(bookFilePath);

    return res.status(200).json({
      id: newBook._id,
      message: 'Welcome to the createBook route ',
    });
  } catch (error) {
    return next(createHttpError(500, 'Error while uploading files!'));
  }
};
export { createBook };
