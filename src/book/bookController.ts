import type { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary.js';
import createHttpError from 'http-errors';
import { Book } from './bookModel.js';
import { deleteLocalFile } from '../utils/fileRemover.js';
import type { IBook } from './bookTypes.js';
import { Types } from 'mongoose';
import type { AuthRequest } from '../middlewares/authenticate.js';

// Creating Book Controller
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
        author: new Types.ObjectId(authorId),
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

// Updating Book Controller
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  // Handling the typecaste error
  const _req = req as AuthRequest;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Extracting the clients data
  const { title, genere } = req.body;
  const bookId = req.params.bookId;
  if (!bookId) {
    return next(createHttpError(201, 'Book id is missing!'));
  }
  const book = await Book.findOne({
    _id: bookId,
  });

  if (!book) {
    return next(createHttpError(404, 'Book not found!'));
  }
  // Checking if the client is authorized to access the book !
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, 'Unathorixed to access the resouce!'));
  }
  let completeCoverImage = '';
  let completeBook = '';
  const coverImageFile = files?.coverImage?.[0];
  const bookFile = files?.file?.[0];

  // Uploading new CoverImage to Cloudinary
  if (coverImageFile) {
    const coverFileSplits = book.coverImage.split('/');
    const coverImagePublicId =
      coverFileSplits.at(-2) + '/' + coverFileSplits.at(-1)?.split('.').at(-2);
    const coverImageMimeType =
      coverImageFile?.mimetype.split('/').at(-1) ?? 'png';
    const fileName = String(coverImageFile?.filename);
    const filePath = String(coverImageFile?.path);
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-covers',
      format: coverImageMimeType,
    });
    completeCoverImage = uploadResult.secure_url;
    await cloudinary.uploader.destroy(coverImagePublicId);
    await deleteLocalFile(filePath);
  }

  // Uploading Book File to  Cloudinary
  if (bookFile) {
    const bookFileMimeType = bookFile?.mimetype.split('/').at(-1) ?? 'pdf';
    const bookFileName = String(bookFile?.filename);
    const bookFilePath = String(bookFile?.path);
    const bookFileSplits = book.file.split('/');
    const bookFilePublicId =
      bookFileSplits.at(-2) + '/' + bookFileSplits.at(-1);

    // Uploading new file to the cloudinary
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: 'raw',
        filename_override: bookFileName,
        folder: 'book-pdf',
        format: bookFileMimeType,
      }
    );
    completeBook = bookFileUploadResult.secure_url;
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: 'raw',
    });
    await deleteLocalFile(bookFilePath);
  }

  const updatedBook = await Book.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genere: genere,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeBook ? completeBook : book.file,
    },
    {
      new: true,
    }
  );
  return res.json({
    updatedBook,
  });
};

// Controller to list books
const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.find(); // Pagination will be introduced later.....
    res.json({ book });
  } catch (error) {
    return next(createHttpError(500, 'Error while getting books '));
  }
  res.json({
    message: 'All Books listed!',
  });
};

// Controller to  get a single book
const getBook = async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;
  if (!bookId) {
    return next(createHttpError(400, 'Bad Request!'));
  }
  try {
    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, 'Book not found!'));
    }
    res.json({
      book,
    });
  } catch (error) {
    return next(createHttpError(500, 'Error while getting the book!'));
  }
};

// Controller to delete a book

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;
  const _req = req as AuthRequest;
  if (!bookId) {
    return next(createHttpError(400, 'Bad Request!'));
  }
  let book;
  try {
    book = await Book.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, 'Book not found '));
    }
    // Checking wheather the client is the author;
  } catch (error) {
    return next(createHttpError(500, 'Error while deleting a book !'));
  }
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, 'Unathorixed to access the resouce!'));
  }
  try {
    const coverFileSplits = book.coverImage.split('/');
    const coverImagePublicId =
      coverFileSplits.at(-2) + '/' + coverFileSplits.at(-1)?.split('.').at(-2);
    const bookFileSplits = book.file.split('/');
    const bookFilePublicId =
      bookFileSplits.at(-2) + '/' + bookFileSplits.at(-1);
    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: 'raw',
    });
  } catch (error) {
    next(createHttpError(500, 'Eroor while destroying file '));
  }

  // Deleting From database
  try {
    await Book.deleteOne({ _id: bookId });
  } catch (error) {}
  res.sendStatus(204);
};

export { createBook, updateBook, listBooks, getBook, deleteBook };
