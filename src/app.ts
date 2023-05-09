import './env';
import express, {
  json,
  Request,
  Response,
} from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import router from './routes';
import { INTERNAL_SERVER_ERROR, nameServer } from './constants';
import { requestLogger, errorLogger } from './middlewares/logger';
import { IErrorStatus } from './types';

const { PORT = 3000 } = process.env;
const app = express();

//  подключитесь к серверу MongoDB
mongoose.connect(nameServer);

app.use(json());

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);// подключаем логер ошибок
app.use(errors());// обработчик ошибок celebrate
// централизованный обработчик ошибок
app.use((error: IErrorStatus, _req: Request, res: Response) => {
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
