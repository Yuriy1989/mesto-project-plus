import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { celebrate, Joi } from 'celebrate';
import { regexLink } from '../constants';
import usersRouter from './users';
import cardsRouter from './cards';
import { createUser, login } from '../controllers/users';
import NotFound from '../utils/notFoundError';
import auth from '../middlewares/auth';

const router = Router();

router.post('/singin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.post('/singup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexLink),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

router.use('*', (req: Request, res: Response, next: NextFunction) => next(new NotFound('Запрашиваемый ресурс не найден')));

export default router;
