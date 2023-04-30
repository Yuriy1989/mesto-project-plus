import { Request, Response } from 'express';
import User from '../models/user';
import { ITestRequest } from 'types';

//возвращает всех пользователей
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await (User.find({}));
    res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Ошибка на стороне сервера"})
  }
}

//возвращает пользователя по _id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await (User.findById(id))
    res.status(200).send(user);
  } catch {
    res.status(500).send({ message: "Ошибка на стороне сервера"})
  }
}

//создаёт пользователя
export const addUser = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body)
    res.status(201).send(newUser + req.body)
  } catch (err) {
    res.status(500).send({ message: "Ошибка на стороне сервера"})
  }
}

//обновляет профиль
export const updateUserProfile = async (req: ITestRequest, res: Response) => {
  const id = req.user?._id;
  try {
    const newUser = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        about: req.body.about,
      }
    )
    res.status(201).send("Профиль обновлен")
  } catch (err) {
    res.status(500).send({ message: "Ошибка на стороне сервера"})
  }
}

//обновляет аватар
export const updateUserAvatar = async (req: ITestRequest, res: Response) => {
  const id = req.user?._id;
  try {
    const newUser = await User.findByIdAndUpdate(
      id,
      { avatar: req.body.avatar }
    )
    res.status(201).send("Аватар обновлен")
  } catch (err) {
    res.status(500).send({ message: "Ошибка на стороне сервера"})
  }
}