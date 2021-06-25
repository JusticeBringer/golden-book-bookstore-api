import { Router } from 'express';
import catalogRouter from './routes/catalog/catalog.routes';
import booksRouter from './routes/catalog/books/books.routes';
import authRouter from './routes/auth/auth.routes';

const routes = Router();

// all the routes
routes.use('/catalog', catalogRouter);
routes.use('/catalog/books', booksRouter);
routes.use('/user', authRouter);

export default routes;
