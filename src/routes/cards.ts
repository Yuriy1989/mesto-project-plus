import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().length(24).hex(),
    link: Joi.string().required(),
  }),
}), createCard);
cardsRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCardById);
cardsRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), likeCard);
cardsRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), dislikeCard);

export default cardsRouter;
