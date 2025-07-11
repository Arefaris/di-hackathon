export function handleChatEvents(io, socket) {
    socket.on('message', ({ sender, message, roomID }) => {

        if (!roomID || !message || !sender) return;
        console.log(`${socket.id} is writing in room ${roomID}: ${message}`); //TODO delete in prod

        socket.join(roomID);
        io.to(roomID).emit('message', {
            sender,
            message,
            from: socket.id
        });
    });
}
