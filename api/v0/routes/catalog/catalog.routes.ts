import express, { Router, Request, Response } from 'express';

export const catalogRouter: Router = express.Router();

catalogRouter.get('/', async (req: Request, res: Response): Promise<Response> => {
  console.log(req);
  return res.status(200).send({
    message: 'Catalog page'
  });
});

export default catalogRouter;
