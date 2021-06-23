import { Router } from 'express';
import routes from './v0/v0.routes';

export const allApiRoutes = Router();

allApiRoutes.use('/api/v0', routes);

export default allApiRoutes;
