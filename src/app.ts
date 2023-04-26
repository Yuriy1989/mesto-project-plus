import http from "http"
import {IncomingMessage, ServerResponse} from "http"
const { PORT = 3000 } = process.env;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  console.log(req.url);
  console.log(req.method)
  console.log(req.headers)


  res.writeHead(200, {
    'Content-type': 'text/plain; charset=utf8'
  })

  res.end;
});

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})


// import express from 'express'

// const app = express();




