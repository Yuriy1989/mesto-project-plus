import express, { json } from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes';
import { ITestRequest } from './types';
import { TEST_ID } from './constants';

const { PORT = 3000 } = process.env;
const app = express();

//подключитесь к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(json());

app.use((req: Request, res: Response, next) => {
  const testRequest = req as ITestRequest;
  testRequest.user = {
    _id: TEST_ID
  }

  next();
})

app.get('/', (req: Request, res: Response) => {
  res.send(
     `<html>
        <body>
            <p>Ответ на сигнал из далёкого космоса</p>
        </body>
        </html>`
  )
});

app.use(router);


app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
});