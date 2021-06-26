import express, { Router, Request, Response } from 'express';
import { getAllBooks } from '../../../../../database/services/book.service';
import { verifyTokenSecret } from '../../../../../util/validation/validation';

export const booksRouter: Router = express.Router();

booksRouter.get('/', verifyTokenSecret, async (req: Request, res: Response): Promise<void> => {
  const { result, errorRet } = await getAllBooks();
  if (!errorRet) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ errorMessage: errorRet });
  }
});

export default booksRouter;
