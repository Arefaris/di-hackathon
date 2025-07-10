const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messagesList = document.getElementById("messages")

const paramsString = window.location.search
const searchParams = new URLSearchParams(paramsString);
const rommID = searchParams.get("id")

console.log(rommID)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (input.value) {

        socket.emit("message", {
            message: input.value,
            roomID: rommID
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