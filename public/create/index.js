const createBtn = document.querySelector(".create")
const nickname = document.querySelector(".nickname")
const room = document.querySelector(".room")

createBtn.addEventListener("click", (event) => {
    event.preventDefault()
    if (nickname.value && room.value) {

        //saving nickname to local storage to use it later
        localStorage.setItem("nickname", `${nickname.value}`);

        const socket = io();

        socket.emit("create", {
            nickname: nickname.value,
            roomname: room.value
        });

        socket.on("created", (data) => {
            const { chatID } = data
            console.log(chatID)
        })

    }
})



