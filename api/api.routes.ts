import { Router } from 'express';
import indexRouter from './v0/routes/index/index.routes';
import routes from './v0/v0.routes';

export const allApiRoutes = Router();

allApiRoutes.use('/api/v0', routes);
allApiRoutes.use('/', indexRouter);

export default allApiRoutes;
