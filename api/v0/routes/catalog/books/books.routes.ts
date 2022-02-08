import express, { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import BookDocument from '../../../../../database/models/book/book.interface';
import BookModel from '../../../../../database/models/book/book.model';
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

booksRouter.get('/:id', verifyTokenSecret, async (req: Request, res: Response): Promise<void> => {
  const userObjectId = mongoose.Types.ObjectId(req.params.id);
  const bookInDb: BookDocument = await BookModel.findOne({ _id: userObjectId });

  if (!bookInDb) {
    res.status(400).send('No book found');
  } else {
    res.status(200).send(bookInDb);
  }
});

export default booksRouter;
