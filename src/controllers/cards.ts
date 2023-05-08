import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { ITestRequest } from '../types';
import {
  OK,
} from '../constants';
import NotFoundError from '../utils/not-found-err';

//  возвращает все карточки
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await (Card.find({}));
    return res.status(OK).send(cards);
  } catch (error) {
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
  }
};

//  создаёт карточку
export const createCard = async (req: ITestRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body; // данные для занесения  коллекцию

    const data = {
      name,
      link,
      owner: req.user?._id,
    };

    const newCard = await Card.create(data);
    return res.status(OK).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(NotFoundError.badRequest('Переданы некорректные данные при создании карточки'));
    }
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
  }
};

//  удаляет карточку по идентификатору
export const deleteCardById = async (req: ITestRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const owner = req.user?._id;
    const user = await Card.findById(cardId);

    if (!user) {
      return next(NotFoundError.notFound('Карточка с указанным _id не найдена'));
    }

    if (owner !== user?.owner.toString()) {
      return next(NotFoundError.badRequest('Недостаточно прав'));
    }

    await Card.findByIdAndRemove(cardId);
    return res.status(OK).send({ message: `Карточка с id = ${cardId} удалена` });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(NotFoundError.badRequest('Переданы некорректные данные для удаления карточки'));
    }
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
  }
};

//  поставить лайк карточке
export const likeCard = async (req: ITestRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const likeCards = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );

    if (!likeCards) {
      return next(NotFoundError.notFound('Карточка с указанным _id не найдена'));
    }

    return res.status(OK).send({ message: 'like' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(NotFoundError.badRequest('Переданы некорректные данные для удаления карточки'));
    }
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
  }
};

//  убрать лайк с карточки
export const dislikeCard = async (req: ITestRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;

  try {
    const dislikeCards = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: id } },
      { new: true },
    );

    if (!dislikeCards) {
      return next(NotFoundError.notFound('Карточка с указанным _id не найдена'));
    }

    return res.status(OK).send({ message: 'delete like' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(NotFoundError.badRequest('Переданы некорректные данные для удаления карточки'));
    }
    return next(NotFoundError.internalServerError('На сервере произошла ошибка'));
  }
};
