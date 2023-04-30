import { Request, Response } from 'express';
import Card from '../models/card';
import { ITestRequest } from 'types';

//возвращает все карточки
export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await (Card.find({}));
    res.status(200).send(cards);
  } catch {
    res.status(500).send({ message: "Ошибка на стороне сервера" })
  }
}

//создаёт карточку
export const createCard = async (req: ITestRequest, res: Response) => {
  let data = req.body; //данные для занесения  коллекцию
  data = {
    ...data,
    owner: req.user?._id
  }

  try {
    const newCard = await Card.create(data);
    res.status(200).send(newCard);
  } catch {
    res.status(500).send({ message: "Ошибка на стороне сервера"})
  }

}

//удаляет карточку по идентификатору
export const deleteCardById = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const deleteCard = await Card.findByIdAndRemove(cardId);
    res.status(200).send(`Карточка с id = ${cardId} удалена`)
  } catch {
    res.status(500).send({ message: "Ошибка на стороне сервера"})
  }
}

//поставить лайк карточке
export const likeCard = async (req: ITestRequest, res: Response) => {
  try {
    const { cardId } = req.params;
    const likeCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true }
    );
    res.status(200).send(`like`)
  } catch {
    res.status(500).send({ message: "Ошибка на стороне сервера"})
  }
}

//убрать лайк с карточки
export const dislikeCard = async (req: ITestRequest, res: Response) => {
  const { cardId } = req.params;
  const id = req.user?._id;
  try {
    const dislikeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: id } },
      { new: true },
    )
    res.status(200).send(`delete like`)
  } catch {
    res.status(500).send({ message: "Ошибка на стороне сервера"})
  }
}