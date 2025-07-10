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

const room = "123456789"


app.use(express.static(__dirname + "/public/"))

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on("message", (data) => {
        console.log(data)
        socket.join(data.room);
        io.to(data.room).emit("message", {
            message: data.message
        })
    })

    socket.on("create", (data) => {
        const {nickename} = data;

        //What is going on here?
        //
    })
});






server.listen(3000, '0.0.0.0', () => {
    console.log('server running at http://localhost:3000');
});