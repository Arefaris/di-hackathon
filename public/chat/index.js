const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messagesList = document.getElementById("messages")
const paramsString = window.location.search
const searchParams = new URLSearchParams(paramsString);
const roomID = searchParams.get("id")
const nickname = localStorage.getItem("nickname");


 socket.emit("join", {
         roomID: roomID,
         nickname: nickname});
 
 socket.on("joined", (data)=>{ 
    renderHistory(data)
 })

 const renderHistory = (data)=>{

    data.messages.forEach(message => {
        const msgcont = document.createElement("li")
        const msgNickName = document.createElement("div")
        const msgText = document.createElement("div")

        if (message.sender_username === nickname){
            msgcont.classList.add("msgcont-me")
            msgNickName.textContent = message.sender_username
            msgText.textContent = message.content
            msgcont.appendChild(msgNickName)
            msgcont.appendChild(msgText)
        }else {
            msgcont.classList.add("msgcont-other")
            msgNickName.textContent = message.sender_username
            msgText.textContent = message.content
            msgcont.appendChild(msgNickName)
            msgcont.appendChild(msgText)
        }

        messagesList.appendChild(msgcont)
    });    
 }


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

    if (nickname == data.sender){
        console.log(data)
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