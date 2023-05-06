import express, {
  json,
  Request,
  Response,
} from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import router from './routes';
import { createUser, login } from './controllers/users';
import { INTERNAL_SERVER_ERROR } from './constants';

const { PORT = 3000 } = process.env;
const app = express();

//  подключитесь к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(json());
app.post('/singin', login);
app.post('/singup', createUser);

// app.use(auth);
app.use('/', router);
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
