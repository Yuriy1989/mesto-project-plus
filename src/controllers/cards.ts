import { Request, Response } from 'express';
import mongoose from 'mongoose';

import Card from '../models/card';
import { ITestRequest } from '../types';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from '../constants';


//возвращает все карточки
export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await (Card.find({}));
    res.status(OK).send(cards);
  } catch {
    res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка на стороне сервера" })
  }
}

//создаёт карточку
export const createCard = async (req: ITestRequest, res: Response) => {
  let data = req.body; //данные для занесения  коллекцию

  if(!data.name || !data.link || !data.owner) {
    const error = new Error("Переданы некорректные данные при создании карточки");
    error.name = "Invalid parameters";
    throw error;
  }

  data = {
    ...data,
    owner: req.user?._id
  }

  try {
    const newCard = await Card.create(data);
    return res.status(200).send(newCard);
  } catch (error) {
    if (error instanceof Error && error.name === "Invalid parameters") {
      return res.status(BAD_REQUEST).send({ message: error.message })
    } else {
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка на стороне сервера" })
    }
  }
}

//удаляет карточку по идентификатору
export const deleteCardById = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const deleteCard = await Card.findByIdAndRemove(cardId);

    if (!deleteCard) {
      const error = new Error("Карточка с указанным _id не найдена");
      error.name = "Invalid parameters";
      throw error;
    }

    return res.status(200).send(`Карточка с id = ${cardId} удалена`)
  } catch (error) {
    if (error instanceof Error && error.name === "Invalid parameters") {
      return res.status(NOT_FOUND).send({ message: error.message })
    } else {
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка на стороне сервера" })
    }
  }
}

//поставить лайк карточке
export const likeCard = async (req: ITestRequest, res: Response) => {
  try {
    const { cardId } = req.params;
    const ObjectID = require("mongodb").ObjectID

    if (!cardId || !ObjectID.isValid(cardId)) {
      const error = new Error("Передан несуществующий _id карточки");
      error.name = "Invalid parameters _id card";
      throw error;
    }

    const likeCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true }
    );

    return res.status(200).send(`like`)
  } catch (error) {
    if (error instanceof Error && error.name === "Invalid parameters _id card") {
      return res.status(NOT_FOUND).send({ message: error.message })
    }

    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: error.message })
    }

    return res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка на стороне сервера" })
  }
}

//убрать лайк с карточки
export const dislikeCard = async (req: ITestRequest, res: Response) => {
  const { cardId } = req.params;
  const id = req.user?._id;
  const ObjectID = require("mongodb").ObjectID

  if (!cardId || !ObjectID.isValid(cardId)) {
    const error = new Error("Передан несуществующий _id карточки");
    error.name = "Invalid parameters _id card";
    throw error;
  }

  try {
    const dislikeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: id } },
      { new: true },
    )

    if (!dislikeCard) {
      const error = new Error("Переданы некорректные данные для снятии лайка.");
      error.name = "Invalid parameters";
      throw error;
    }

    return res.status(200).send(`delete like`)
  } catch (error) {
    if (error instanceof Error && error.name === "Invalid parameters _id card") {
      return res.status(NOT_FOUND).send({ message: error.message })
    }

    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: error.message })
    }

    return res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка на стороне сервера" })
  }
}