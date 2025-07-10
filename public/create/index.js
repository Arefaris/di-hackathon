const createBtn = document.querySelector(".create")
const socket = io();
const nickname = document.querySelector(".nickname")
const room = document.querySelector(".room")

createBtn.addEventListener("click", (event)=>{
     event.preventDefault()
     if (nickname.value && room.value) {

        socket.emit("create", {
            nickname: nickname.value,
            roomname: room.value
        });

    }
})

socket.on("created", (data)=>{
    const {chatID} = data

    console.log(chatID)
})


