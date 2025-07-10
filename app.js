import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { v4 as uuidv4 } from 'uuid';


const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

const room = "123456789"

app.use(express.static(__dirname + "/public/"))

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("message", (data) => {
        const {message, roomID} = data;
        socket.join(roomID);
        
        io.to(roomID).emit("message", {
            message
        });
    })

    socket.on("create", (data) => {
        const {nickename, roomname} = data;
        const chatID = uuidv4();
        //TODO: Save to DB
        socket.join(chatID);
        io.to(chatID).emit("created", {chatID});
    })
});






server.listen(3000, '0.0.0.0', () => {
    console.log('server running at http://localhost:3000');
});