import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SessionRequest } from '../types';
import Unauthorized from '../utils/unauthorizedError';

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string || '088c9d35720d3ec0e34ad7d9677bd2ede9892c4434c17a866605d25f8002c4f0');
  } catch (error) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;

  next();
};
