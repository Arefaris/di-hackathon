const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messagesList = document.getElementById("messages")
const paramsString = window.location.search
const searchParams = new URLSearchParams(paramsString);
const roomID = searchParams.get("id")
const nickname = localStorage.getItem("nickname");

 socket.emit("join", {
         roomID: roomID});
 
 socket.on("joined", (data)=>{ 
    console.log(data)
 })

 if(!nickname){
    nickname = "Anonymous"
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!roomID){
        alert("Room id is not correct")
    }

    if (input.value) {
        socket.emit("message", {
            sender: nickname,
            message: input.value,
            roomID: roomID
        });
        
        input.value = '';
    }
});

//reciving message from server
socket.on("message", (data)=>{
     
    const msgcont = document.createElement("li")
    const msgNickName = document.createElement("div")
    const msgText = document.createElement("div")

    if (socket.id == data.from){
        msgcont.classList.add("msgcont-me")
        msgNickName.textContent = data.sender
        msgText.textContent = data.message
        msgcont.appendChild(msgNickName)
        msgcont.appendChild(msgText)
    }else {
        msgcont.classList.add("msgcont-other")
        msgNickName.textContent = data.sender
        msgText.textContent = data.message
        msgcont.appendChild(msgNickName)
        msgcont.appendChild(msgText)
    }
     
     
     messagesList.appendChild(msgcont)
})