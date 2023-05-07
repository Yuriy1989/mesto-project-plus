import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { IErrorStatus, ITestRequest } from '../types';
import {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
} from '../constants';

//  возвращает все карточки
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await (Card.find({}));
    res.status(OK).send(cards);
  } catch (error) {
    next(error);
  }
};

//  создаёт карточку
export const createCard = async (req: ITestRequest, res: Response, next: NextFunction) => {
  try {
    let data = req.body; // данные для занесения  коллекцию
    if (!data.name || !data.link) {
      const error: IErrorStatus = new Error('Переданы некорректные данные при создании карточки');
      error.statusCode = BAD_REQUEST;
      throw error;
    }

    data = {
      ...data,
      owner: req.user?._id,
    };

    const newCard = await Card.create(data);
    res.status(OK).send(newCard);
  } catch (error) {
    next(error);
  }
};

//  удаляет карточку по идентификатору
export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const deleteCard = await Card.findByIdAndRemove(cardId);

    if (!deleteCard) {
      const error: IErrorStatus = new Error('Карточка с указанным _id не найдена');
      error.statusCode = NOT_FOUND;
      throw error;
    }

    res.status(200).send({ message: `Карточка с id = ${cardId} удалена` });
  } catch (error) {
    next(error);
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
      const error: IErrorStatus = new Error('Карточка с указанным _id не найдена');
      error.statusCode = NOT_FOUND;
      throw error;
    }
    res.status(OK).send({ message: 'like' });
  } catch (error) {
    next(error);
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
      const error: IErrorStatus = new Error('Карточка с указанным _id не найдена');
      error.statusCode = NOT_FOUND;
      throw error;
    }

    res.status(OK).send({ message: 'delete like' });
  } catch (error) {
    next(error);
  }
};
