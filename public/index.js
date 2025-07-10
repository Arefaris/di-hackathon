const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messagesList = document.getElementById("messages")
const room = "123456789"

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (input.value) {

        socket.emit("message", {
            message: input.value,
            roomId: room
        });
        input.value = '';
    }
});


socket.on("message", (data)=>{
     console.log(data.message)

     const msg = document.createElement("li")

     msg.textContent = data.message
     messagesList.appendChild(msg)
})