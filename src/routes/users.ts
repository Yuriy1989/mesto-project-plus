import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUser,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUserById);
usersRouter.patch('/users/me', updateUserProfile);
usersRouter.get('/users/me', getUser);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

export default usersRouter;
