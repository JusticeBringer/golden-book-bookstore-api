import express, { Router, Request, Response } from 'express';

export const indexRouter: Router = express.Router();

indexRouter.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'This is the API. Please read the readme file to see the documentation!'
  });
});

export default indexRouter;
