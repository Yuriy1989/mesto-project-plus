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
} from '../constants';
import NotFoundError from '../utils/not-found-err';

//  возвращает всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await (User.find({}));
    return res.status(OK).send(users);
  } catch (error) {
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
  }
};

//  получаем информацию по _id пользователя
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await (User.findById(id));

    if (!user) {
      return next(NotFoundError.notFound('Пользователь по указанному _id не найден'));
    }

    return res.status(OK).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(NotFoundError.badRequest('Переданы некорректные данные для удаления карточки'));
    }
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
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
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('E11000')) {
      return next(NotFoundError.badRequest('Пользователь с таким email уже есть'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(NotFoundError.badRequest('Переданы некорректные данные при создании пользователя'));
    }
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
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
      return next(NotFoundError.notFound('Пользователь с указанным _id не найден'));
    }

    return res.status(OK).send(updateUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(NotFoundError.badRequest('Переданы некорректные данные при обновлении профиля'));
    }
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
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
      return next(NotFoundError.notFound('Пользователь с указанным _id не найден'));
    }

    return res.status(OK).send({ message: 'Аватар обновлен' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(NotFoundError.badRequest('Переданы некорректные данные при обновлении аватара'));
    }
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
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
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
  }
};

// возвращает информацию о текущем пользователе
export const getUser = async (req: ITestRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(NotFoundError.notFound('Пользователь с указанным _id не найден'));
    }
    return res.status(OK).send({ user });
  } catch {
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
  }
};
