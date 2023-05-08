import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SessionRequest } from '../types';
import NotFoundError from '../utils/not-found-err';

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NotFoundError.unauthorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    return NotFoundError.unauthorized('Необходима авторизация');
  }

  req.user = payload;

  next();
};
