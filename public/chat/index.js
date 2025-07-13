const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messagesList = document.getElementById("messages")
const nickname = localStorage.getItem("nickname");
const chatsEl = document.querySelector(".chats")


 
socket.on("joined", (data)=>{ 
    renderHistory(data)
 })


socket.emit("chatsList")

socket.on("chatsList", (data)=>{
    console.log(data)
    renderChats(data)
})

const renderChats = (data)=>{
    data.forEach(chat =>{
        console.log(chat)
        const room = document.createElement("div")
        room.classList.add("room")
        const title = document.createElement("div")
        title.textContent = chat.name
        room.appendChild(title)
        joinEvent(room, chat.guid)
        chatsEl.appendChild(room)
    })
}

const joinEvent = (room, guid)=>{
    room.addEventListener("click", ()=>{

        socket.emit("join", {
        roomID: guid});
    })
}
 
//TODO: make this one function
// REFACTOR LATER
 const renderHistory = (data)=>{

    data.messages.forEach(message => {
        const msgcont = document.createElement("li")
        const msgNickName = document.createElement("div")
        const msgText = document.createElement("div")
        console.log(message)
        if (message.sender === nickname){
            
            msgcont.classList.add("msgcont-me")
            msgNickName.textContent = message.sender
            msgText.textContent = message.message
            msgcont.appendChild(msgNickName)
            msgcont.appendChild(msgText)
        }else {
            msgcont.classList.add("msgcont-other")
            msgNickName.textContent = message.sender
            msgText.textContent = message.message
            msgcont.appendChild(msgNickName)
            msgcont.appendChild(msgText)
        }

        messagesList.appendChild(msgcont)
        msgcont.scrollIntoView({ behavior: 'smooth' })
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
     msgcont.scrollIntoView({ behavior: 'smooth' })
     
})