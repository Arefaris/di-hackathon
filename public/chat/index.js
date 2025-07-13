const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messagesList = document.getElementById("messages")
const nickname = localStorage.getItem("nickname");
const chatsEl = document.querySelector(".chats")
const modal = document.getElementById('modal');
const modalCreate = document.getElementById("modal-create")
const joinBtn = document.querySelector(".join")
const confirmJoinBtn = document.querySelector(".join-chat")
const closeBtn = document.querySelector(".close-btn")
const closeBtnCreate = document.querySelector(".close-btn-create")
const roomNameInput = document.querySelector(".room-name-input")
const roomNameInputCreate = document.querySelector(".room-name-input-create")

const createBtn = document.querySelector(".create")
const confirmCreate = document.querySelector(".join-chat-create")
let currentRoom = ""
 
socket.on("joined", (data)=>{ 
    messagesList.innerHTML = ""
    
    //making nodelist into array
    const rooms = [...document.querySelectorAll(".room")]

    //if current room exist
    const index = rooms.findIndex(room => room.firstChild.innerHTML == data.name)
  
    if(index === -1){
        renderChats([data])
    }
    renderHistory(data)
 })


socket.emit("chatsList")

socket.on("error", (data)=>{
    console.log(data)
})

socket.on("chatsList", (data)=>{
    console.log(data)
    chatsEl.innerHTML = ""
    renderChats(data)
})

const renderChats = (data)=>{
    
    data.forEach(chat =>{
        const room = document.createElement("div")
        room.classList.add("room")
        const title = document.createElement("div")
        title.textContent = chat.name
        room.appendChild(title)
        joinEvent(room, chat.guid)
        chatsEl.appendChild(room)
    })
}

joinBtn.addEventListener("click", ()=>{openModal(modal)})

closeBtn.addEventListener("click", ()=>{closeModal(modal)})

closeBtnCreate.addEventListener("click", ()=>{closeModal(modalCreate)})

createBtn.addEventListener("click", ()=>{openModal(modalCreate)})

confirmCreate.addEventListener("click", (event)=> {createRoom(event)})

const createRoom = (event)=>{
    event.preventDefault()
    if (roomNameInputCreate.value) {

        socket.emit("create", {
            nickname: nickname.value,
            roomname: roomNameInputCreate.value
        });

        socket.on("created", (data) => {

            //refactor to get data
            location.reload()
        })

    }
}

function openModal(modal) {
      modal.classList.add('active');
    }

function closeModal(modal) {
      modal.classList.remove('active');
    }

function closeModal(modal) {
      modal.classList.remove('active');
    }

const joinEvent = (room, guid)=>{
    room.addEventListener("click", ()=>{
        socket.emit("join", {
        roomID: guid});
        currentRoom = guid
    })
}
 
confirmJoinBtn.addEventListener("click", (event) => {
    event.preventDefault()
    
    if (roomNameInput.value) {
        socket.emit("join", {
        roomID: roomNameInput.value});
        closeModal()

    }

})


//TODO: make this one function
// REFACTOR LATER
 const renderHistory = (data)=>{

    data.messages.forEach(message => {
        const msgcont = document.createElement("li")
        const msgNickName = document.createElement("div")
        const msgText = document.createElement("div")
   
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


form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(currentRoom)
    if (input.value) {
        socket.emit("message", {
            message: input.value,
            roomID: currentRoom
        });
        
        input.value = '';
    }
});


//reciving message from server
socket.on("message", (data)=>{
    console.log(data)
    const msgcont = document.createElement("li")
    const msgNickName = document.createElement("div")
    const msgText = document.createElement("div")
    
    if (nickname == data.sender){
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