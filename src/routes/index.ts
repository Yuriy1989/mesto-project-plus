import {
  Router,
  Request,
  Response,
} from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import { NOT_FOUND } from '../constants';

const router = Router();

router.use('/', usersRouter);
router.use('/', cardsRouter);
router.use((req: Request, res: Response) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

export default router;
