import { Router } from "express";
import { createBook } from "./bookController.js";
const bookRouter = Router();



bookRouter.post("/create-book" ,createBook)
export default bookRouter;