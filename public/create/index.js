const createBtnEl = document.querySelector(".create")
const nickname = document.querySelector(".nickname")
const room = document.querySelector(".room")

createBtnEl.addEventListener("click", (event)=>{
     event.preventDefault()
     if (nickname.value && room.value) {

        socket.emit("create", {
            nickname: nickname.value,
            roomname: room.value
        });

    }
})

socket.on("created", (data)=>{
    const {chatId} = data

    console.log(chatId)
})


