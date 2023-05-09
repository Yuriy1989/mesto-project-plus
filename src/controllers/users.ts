import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user';
import { ITestRequest } from '../types';
import {
  CREATED,
  OK,
  SALT,
  UNAUTHORIZED,
} from '../constants';
import Unauthorized from '../utils/unauthorizedError';
import BadRequest from '../utils/badRequestError';
import InternalServer from '../utils/internalServerError';
import NotFound from '../utils/notFoundError';
import Conflict from '../utils/conflictError';

//  возвращает всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await (User.find({}));
    return res.status(OK).send(users);
  } catch (error) {
    return next(new InternalServer('На сервере произошла ошибка'));
  }
};

//  получаем информацию по _id пользователя
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await (User.findById(id));

    if (!user) {
      return next(new NotFound('Пользователь по указанному _id не найден'));
    }

    return res.status(OK).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequest('Переданы некорректные данные для удаления карточки'));
    }
    return next(new InternalServer('На сервере произошла ошибка'));
  }
};

//  создаёт пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const hash = await bcrypt.hash(password, SALT);
    const data = {
      email,
      password: hash,
    };

    const newUser = await User.create(data);
    return res.status(CREATED).send(newUser);
  } catch (error: any) {
    if (error?.code === 11000) {
      return next(new Conflict('Пользователь с таким email уже есть'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest('Переданы некорректные данные при создании пользователя'));
    }
    return next(new InternalServer('На сервере произошла ошибка'));
  }
};

//  обновляет профиль
export const updateUserProfile = async (req: ITestRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { name, about } = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        about,
      },
      { new: true, runValidators: true },
    );

    if (!updateUser) {
      return next(new NotFound('Пользователь с указанным _id не найден'));
    }

    return res.status(OK).send(updateUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
    }
    return next(new InternalServer('На сервере произошла ошибка'));
  }
};

//  обновляет аватар
export const updateUserAvatar = async (req: ITestRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;

  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    );

    if (!updateUser) {
      return next(new NotFound('Пользователь с указанным _id не найден'));
    }

    return res.status(OK).send({ message: 'Аватар обновлен' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
    }
    return next(new InternalServer('На сервере произошла ошибка'));
  }
};

//  авторизация
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    return res.status(OK).send({ _id: user._id, token });
  } catch (error) {
    if (error instanceof Unauthorized && error.statusCode === UNAUTHORIZED) {
      return next(new Unauthorized(error.message));
    }
    return next(new InternalServer('На сервере произошла ошибка'));
  }
};

// возвращает информацию о текущем пользователе
export const getUser = async (req: ITestRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFound('Пользователь с указанным _id не найден'));
    }
    return res.status(OK).send({ user });
  } catch {
    return next(new InternalServer('На сервере произошла ошибка'));
  }
};
