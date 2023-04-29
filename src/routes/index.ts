import { Router } from 'express';
import usersRouter from './users';

const router = Router();

router.get("/users", usersRouter);

export default router;
