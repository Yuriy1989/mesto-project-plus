import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUser,
} from '../controllers/users';
import { regexLink } from '../constants';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUserProfile);
usersRouter.get('/me', getUser);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regexLink),
  }),
}), updateUserAvatar);
usersRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), getUserById);

export default usersRouter;
