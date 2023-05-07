import express, {
  json,
  Request,
  Response,
} from 'express';
import mongoose from 'mongoose';
import { errors, celebrate, Joi } from 'celebrate';
import router from './routes';
import { createUser, login } from './controllers/users';
import { INTERNAL_SERVER_ERROR } from './constants';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;
const app = express();

//  подключитесь к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(json());

app.use(requestLogger);

app.post('/singin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/singup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// app.use(auth);
app.use('/', router);

app.use(errorLogger);// подключаем логер ошибок
app.use(errors());// обработчик ошибок celebrate
// централизованный обработчик ошибок
app.use((error: any, _req: Request, res: Response) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = error;
  return res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
});

//  запуск сервера
app.listen(PORT);
