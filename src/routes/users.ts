import { Router } from 'express';
import {
  getUsers,
  getUserById,
  addUser,
  updateUserProfile,
  updateUserAvatar
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUserById);
usersRouter.post('/users', addUser);
usersRouter.patch('/users/me', updateUserProfile);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

export default usersRouter;
