import { Router } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';

const router = Router();

router.use("/", usersRouter);
router.use("/", cardsRouter)

export default router;
