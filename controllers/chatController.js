export function handleChatEvents(io, socket) {
    socket.on('message', ({ message, roomID }) => {

        if (!roomID || !message) return;
        console.log(`${socket.id} is writing in room ${roomID}: ${message}`); //TODO delete in prod

        socket.join(roomID);
        io.to(roomID).emit('message', {
            message,
            from: socket.id
        });
    });
}
