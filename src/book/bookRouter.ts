import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from './bookController.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import multer from 'multer';
import authenticate from '../middlewares/authenticate.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'),
  limits: { fileSize: 10 * 1024 * 1024 },
});
const bookRouter = Router();

bookRouter.post(
  '/',
  authenticate,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    {
      name: 'file',
      maxCount: 1,
    },
  ]),
  createBook
);
bookRouter.patch(
  '/:bookId',
  authenticate,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    {
      name: 'file',
      maxCount: 1,
    },
  ]),
  updateBook
);
bookRouter.get('/', listBooks);
bookRouter.get('/:bookId', getBook);
bookRouter.delete('/:bookId', authenticate, deleteBook);
export default bookRouter;
