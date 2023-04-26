// import http from "http"
// import {IncomingMessage, ServerResponse} from "http"

// const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
//   console.log(req.url);
//   console.log(req.method)
//   console.log(req.headers)
// });


// server.listen(3000);
//express


import express from 'express'

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})


