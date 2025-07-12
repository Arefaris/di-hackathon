const joinBtn = document.querySelector(".join")
const nickname = document.querySelector(".nickname")
const room = document.querySelector(".room")


joinBtn.addEventListener("click", (event) => {
    event.preventDefault()
    
    if (nickname.value && room.value) {
        
        //saving nickname to local storage to use it later
        localStorage.setItem("nickname", `${nickname.value}`);

        const socket = io();
        
        //making sure that chat exist
        socket.emit("chatCheck", {
        roomID: room.value});
            
        socket.on("chatCheck", (data)=>{ 
            if (data.chatFlag){
                 window.location.href = `/chat/?id=${room.value}`
            }else {
                alert("No such room exist, please enter a valid room")
            }
           
        })
    }
})



