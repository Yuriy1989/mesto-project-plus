import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { ITestRequest } from '../types';
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  SALT,
} from '../constants';

//  возвращает всех пользователей
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await (User.find({}));
    return res.status(OK).send(users);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

//  возвращает пользователя по _id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await (User.findById(id));

    if (!user) {
      const error = new Error('Пользователь по указанному _id не найден');
      error.name = 'Not Found';
      throw error;
    }

    return res.status(OK).send(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'Not Found') {
      return res.status(NOT_FOUND).send({ message: error.message });
    }

    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: error.message });
    }

    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

//  создаёт пользователя
export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
    } = req.body;
    if (!email || !password) {
      const error = new Error('Переданы некорректные данные при создании пользователя');
      error.name = 'Invalid parameters';
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
    return res.status(CREATED).send(newUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'Invalid parameters') {
      return res.status(BAD_REQUEST).send({ message: error.message });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).send({ message: error.message });
    }

    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

//  обновляет профиль
export const updateUserProfile = async (req: ITestRequest, res: Response) => {
  const id = req.user?._id;
  const { name, about } = req.body;
  try {
    if (!name || !about) {
      const error = new Error('Переданы некорректные данные при обновлении профиля');
      error.name = 'Invalid parameters';
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
      const error = new Error('Пользователь с указанным _id не найден');
      error.name = 'Not Found';
      throw error;
    }

    return res.status(OK).send(updateUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'Invalid parameters') {
      return res.status(BAD_REQUEST).send({ message: error.message });
    }

    if (error instanceof Error && error.name === 'Not Found') {
      return res.status(NOT_FOUND).send({ message: error.message });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).send({ message: error.message });
    }

    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: error.message });
    }

    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

//  обновляет аватар
export const updateUserAvatar = async (req: ITestRequest, res: Response) => {
  const id = req.user?._id;
  const { avatar } = req.body;

  try {
    if (!avatar) {
      const error = new Error('Переданы некорректные данные при обновлении аватара');
      error.name = 'Invalid_parameters';
      throw error;
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    );

    if (!updateUser) {
      const error = new Error('Пользователь с указанным _id не найден');
      error.name = 'Not Found';
      throw error;
    }

    return res.status(OK).send({ message: 'Аватар обновлен' });
  } catch (error) {
    if (error instanceof Error && error.name === 'Invalid_parameters') {
      return res.status(BAD_REQUEST).send({ message: error.message });
    }

    if (error instanceof Error && error.name === 'Not Found') {
      return res.status(NOT_FOUND).send({ message: error.message });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).send({ message: error.message });
    }

    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: error.message });
    }

    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

// login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error = new Error('Переданы некорректные данные при обновлении аватара');
      error.name = 'Invalid_parameters';
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Неправильные почта или пароль');
      error.name = 'Not Found';
      throw error;
    } else {
      return res.status(200).send({ message: 'JWT' });
    }
  } catch {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};
