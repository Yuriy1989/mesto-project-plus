import { Request, Response } from 'express';
import User from '../models/user';

//возвращает всех пользователей
export const getUsers = async (req: Request, res: Response) => {
  const users = await (User.find({}));

  return res.status(200).send(users);
}

//возвращает пользователя по _id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    const user = await (User.findById(id))

    res.status(200).send(user);
  } catch {
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