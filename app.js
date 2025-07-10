import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';


const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});


app.use(express.static(__dirname + "/public/"))

io.on('connection', (socket) => {
  console.log('a user connected');
   socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('server running at http://localhost:3000');
});