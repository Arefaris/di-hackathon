import { v4 as uuidv4 } from 'uuid';

export function handleRoomEvents(io, socket) {
  socket.on('create', ({ nickname, roomname }) => {
    const roomID = uuidv4();

    // TODO: сохранить комнату и ник в БД (или в памяти)
    socket.join(roomID);
    io.to(roomID).emit('created', { chatID: roomID });
  });

  socket.on('join', ({ roomID }) => {
    socket.join(roomID);
    socket.emit('joined', { roomID });
  });
}