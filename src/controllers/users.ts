import { NextFunction, Request, Response } from 'express';
// import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IErrorStatus, ITestRequest } from '../types';
import {
  BAD_REQUEST,
  CREATED,
  // INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  SALT,
  // UNAUTHORIZED,
} from '../constants';

//  возвращает всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await (User.find({}));
    res.status(OK).send(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await (User.findById(id));

    if (!user) {
      const error: IErrorStatus = new Error('Пользователь по указанному _id не найден');
      error.statusCode = NOT_FOUND;
      throw error;
    }

    res.status(OK).send(user);
  } catch (error) {
    next(error);
  }
};

//  создаёт пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      password,
    } = req.body;
    if (!email || !password) {
      const error: IErrorStatus = new Error('Переданы некорректные данные при создании пользователя');
      error.statusCode = BAD_REQUEST;
      throw error;
    }

    let data = req.body;
    const hash = await bcrypt.hash(password, SALT);
    data = {
      ...data,
      email,
      password: hash,
    };

    const newUser = await User.create(data);
    res.status(CREATED).send(newUser);
  } catch (error) {
    next(error);
  }
};

//  обновляет профиль
export const updateUserProfile = async (req: ITestRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { name, about } = req.body;
  try {
    if (!name || !about) {
      const error: IErrorStatus = new Error('Переданы некорректные данные при обновлении профиля');
      error.statusCode = BAD_REQUEST;
      throw error;
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      { new: true, runValidators: true },
    );

    if (!updateUser) {
      const error: IErrorStatus = new Error('Пользователь с указанным _id не найден');
      error.statusCode = NOT_FOUND;
      throw error;
    }

    res.status(OK).send(updateUser);
  } catch (error) {
    next(error);
  }
};

//  обновляет аватар
export const updateUserAvatar = async (req: ITestRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { avatar } = req.body;

  try {
    if (!avatar) {
      const error: IErrorStatus = new Error('Переданы некорректные данные при обновлении аватара');
      error.statusCode = BAD_REQUEST;
      throw error;
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    );

    if (!updateUser) {
      const error: IErrorStatus = new Error('Пользователь с указанным _id не найден');
      error.statusCode = NOT_FOUND;
      throw error;
    }

    res.status(OK).send({ message: 'Аватар обновлен' });
  } catch (error) {
    next(error);
  }
};

//  авторизация
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '20m' });
      res.status(OK).send({ _id: user.id, token });
    })
    .catch((error) => {
      next(error);
    });
};

// возвращает информацию о текущем пользователе
export const getUser = (req: ITestRequest, res: Response, next: NextFunction) => {
  const id = req.user!._id;

  console.log(req.body);
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Пользователь по указанному _id не найден'));
      }
      return res.status(OK).send({ user });
    })
    .catch((error) => {
      next(error);
    });
};
