import { Router } from "express";
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard
} from "../controllers/cards";

const cardsRouter = Router();

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:cardId', deleteCardById);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

export default cardsRouter;