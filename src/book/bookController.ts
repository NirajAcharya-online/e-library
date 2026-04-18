import type { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary.js';
import createHttpError from 'http-errors';
import { Book } from './bookModel.js';
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  // Extracting data given by the client!
  const { title, genere } = req.body;
  const coverImageFile = files?.coverImage?.[0];
  const bookFile = files?.file?.[0];

  if (!coverImageFile || !bookFile) {
    return next(createHttpError(400, 'Cover Image is necessary!'));
  }

  // Extracting details of coverImage for cloudinary
  const coverImageMimeType =
    coverImageFile?.mimetype.split('/').at(-1) ?? 'png';
  const fileName = String(coverImageFile?.filename);
  const filePath = String(coverImageFile?.path);

  // Uploading cover Image in clodinary!!

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-covers',
      format: coverImageMimeType,
    });
    console.log('Upload successfull');

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
    console.log(bookFileUploadResult);

    // Uploading files Url to Database

    const newBook = await Book.create({
      title,
      genere,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    return res.json({
      message: 'Welcome to the createBook route ',
    });
  } catch (error) {
    return next(createHttpError(500, 'Error while uploading files!'));
  }
};
export { createBook };
