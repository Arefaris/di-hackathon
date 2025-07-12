const joinBtn = document.querySelector(".join")
const nickname = document.querySelector(".nickname")
const room = document.querySelector(".room")

joinBtn.addEventListener("click", (event) => {
    event.preventDefault()
    
    if (nickname.value && room.value) {
        
        //saving nickname to local storage to use it later
        localStorage.setItem("nickname", `${nickname.value}`);

        const socket = io();

        socket.emit("join", {
         roomID: room.value});
            
        socket.on("joined", (data)=>{ 
            console.log(data)
            //window.location.href = `/chat/?id=${chatID}`
        })
    }
})



