// import http from "http"
// import {IncomingMessage, ServerResponse} from "http"

// const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
//   console.log(req.url);
//   console.log(req.method)
//   console.log(req.headers)
// });


// server.listen(3000);


// import express from 'express'
// import { Request, Response } from 'express'

// const { PORT = 3000 } = process.env;

// const app = express();

// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`)
// })

// app.get('/', (req: Request, res: Response) => {
//   res.send(
//     `
//     <html>
//     <body>
//         <p>Ответ на сигнал из далёкого космоса</p>
//     </body>
//     </html>
//     `
//   )
// })

// app.get('/', (req: Request, res: Response) => {
//   res.status(404);
//   res.send('<h1>Страница не найдена</h1>');
// });