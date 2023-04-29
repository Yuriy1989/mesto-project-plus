import express, { json } from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes';


const { PORT = 3001 } = process.env;
const app = express();
// const router = Router();

//подключитесь к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(json());

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