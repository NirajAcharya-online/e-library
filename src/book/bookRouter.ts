import { Router } from 'express';
import { createBook } from './bookController.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import multer from 'multer';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'),
  limits: { fileSize: 3e7 }, // 3e7 => 30mb 3 to the power 7
});
const bookRouter = Router();

bookRouter.post(
  '/',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    {
      name: 'file',
      maxCount: 1,
    },
  ]),
  createBook
);
export default bookRouter;
