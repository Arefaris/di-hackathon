import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);

app.use(express.static(__dirname + "/public/"))

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});