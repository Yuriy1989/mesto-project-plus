import express, { json, Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes';
import { ITestRequest } from './types';
import { TEST_ID } from './constants';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

const { PORT = 3000 } = process.env;
const app = express();

//  подключитесь к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(json());

app.use((req: Request, res: Response, next) => {
  const testRequest = req as ITestRequest;
  testRequest.user = {
    _id: TEST_ID,
  };
  next();
});

app.post('/singin', login);
app.post('/singup', createUser);

app.use(auth);
app.use('/', router);

//  запуск сервера
app.listen(PORT);
