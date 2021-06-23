import { Router } from 'express';
import catalogRouter from './routes/catalog/catalog.routes';
import booksRouter from './routes/catalog/books/books.routes';

const routes = Router();

// all the routes
routes.use('/catalog', catalogRouter);
routes.use('/catalog/books', booksRouter);

export default routes;
