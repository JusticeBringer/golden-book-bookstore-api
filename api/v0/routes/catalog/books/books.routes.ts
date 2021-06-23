import express, { Router, Request, Response } from 'express';
import { getAllBooks } from '../../../../../database/services/book.service';
import { isValidApiCall } from '../../../../../util/helpers';

export const booksRouter: Router = express.Router();

booksRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  if (isValidApiCall(req.url as string)) {
    const { result, errorRet } = await getAllBooks();
    if (!errorRet) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ errorMessage: errorRet });
    }
  } else {
    res.status(403).json({ error: 'Unathorized' });
  }
});

export default booksRouter;
