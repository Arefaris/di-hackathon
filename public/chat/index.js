const socket = io({
  withCredentials: true
});;
const nickname = localStorage.getItem("nickname");
let currentRoom = "";

//DOM Elements
const form = document.getElementById("form");
const input = document.getElementById("input");
const messagesList = document.getElementById("messages");
const chatsEl = document.querySelector(".chats");
const chatHeader = document.querySelector(".chat-area-header")
const modalJoin = document.getElementById("modal-join");
const modalCreate = document.getElementById("modal-create");

const openJoinBtn = document.querySelector(".open-join-modal");
const openCreateBtn = document.querySelector(".open-create-modal");
const closeBtns = document.querySelectorAll(".close-btn");

const joinRoomInput = document.getElementById("join-room-input");
const createRoomInput = document.getElementById("create-room-input");

const confirmJoinBtn = document.querySelector(".confirm-join");
const confirmCreateBtn = document.querySelector(".confirm-create");

let refresh = true
//Event listeners
openJoinBtn.addEventListener("click", () => toggleModal(modalJoin, true));
openCreateBtn.addEventListener("click", () => toggleModal(modalCreate, true));
closeBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    const id = btn.dataset.modal;
    toggleModal(document.getElementById(id), false);
  })
);

confirmJoinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const roomID = joinRoomInput.value.trim();
  if (roomID) {
    socket.emit("join", { roomID });
    toggleModal(modalJoin, false);
  }
});

confirmCreateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const roomname = createRoomInput.value.trim();
  if (roomname) {
    socket.emit("create", { nickname, roomname });
    socket.once("created", (data) => {
        const {chatID, roomname} = data
        //adding chat to the list
        appendChatIfNotExists({
            name: roomname,
            guid: chatID
        })
        toggleModal(modalCreate, false)
    });
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("message", {
      message: input.value,
      roomID: currentRoom
    });
    input.value = "";
  }
});

//Socket Events
socket.emit("chatsList");

socket.on("joined", (data) => {

  currentRoom = data.guid;
  messagesList.innerHTML = "";
  appendChatIfNotExists(data);;
  renderMessages(data.messages);
});

socket.on("chatsList", renderChats);

socket.on("message", renderMessage);

socket.on("error", console.error);

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true
  } catch (err) {
    console.error(err);
    return false
  }
}

//Rendering
function renderChats(chats) {
  chatsEl.innerHTML = "";
  chats.forEach(({ name, guid }) => {
    const room = document.createElement("div");
    const linkIcon = document.createElement("i")
    linkIcon.classList.add("copy-room", "fa-solid", "fa-share-from-square")
    room.classList.add("room");
    room.textContent = name;
    room.appendChild(linkIcon)
    
    linkIcon.addEventListener("click", (event)=>{
      event.stopPropagation()
      linkIcon.style.color = "green"
      copyToClipboard(guid)
    })

    room.addEventListener("click", () => {
      currentRoom = guid;
      chatHeader.textContent = name
      socket.emit("join", { roomID: guid });
    });
    chatsEl.appendChild(room);
  });

  if (refresh){
     const firstRoom = chatsEl.firstElementChild;
     if(firstRoom){
      firstRoom.click();
      refresh=false
     }
     
  }  
}

function appendChatIfNotExists(chat) {
  const exists = [...document.querySelectorAll(".room")].some(room =>
    room.textContent === chat.name
  );
  if (!exists) {
    const room = document.createElement("div");
    const linkIcon = document.createElement("i")
    linkIcon.classList.add("copy-room", "fa-solid", "fa-share-from-square")
    room.classList.add("room");
    room.textContent = chat.name;
    room.appendChild(linkIcon)
    
     linkIcon.addEventListener("click", (event)=>{
      event.stopPropagation()
      linkIcon.style.color = "green"
      copyToClipboard(guid)
    })

    
    room.addEventListener("click", (event) => {
      currentRoom = chat.guid;
      chatHeader.textContent = event.target.textContent;
      socket.emit("join", { roomID: chat.guid });
    });
    chatsEl.appendChild(room);
  }
}

let namesWithColor = []
function renderMessages(messages) {
  messages.forEach(renderMessage);
  console.log(messages)
}


function getRandomHSLColor() {
  const h = Math.floor(Math.random() * 360);       // оттенок от 0 до 359
  const s = Math.floor(Math.random() * 51) + 50;   // насыщенность от 50% до 100%
  const l = Math.floor(Math.random() * 31) + 40;   // яркость от 40% до 70%
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function renderMessage({ sender, message, timestamp }) {

  const li = document.createElement("li");
  li.className = sender === nickname ? "msgcont-me" : "msgcont-other";
  
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  
  if (sender !== nickname) {
    const name = document.createElement("div");
    name.textContent = sender;
    name.className = "name"

    const existing = namesWithColor.find(entry => entry.name === sender);

  if (existing) {
    name.style.color = existing.color;
  } else {
    const color = getRandomHSLColor();
    name.style.color = color;
    namesWithColor.push({
      name: sender,
      color: color
    });
  }
    
    li.append(name)
  }
  
  const text = document.createElement("div");
  text.textContent = message;
  const time = document.createElement("div")
  time.textContent = `${hours}:${minutes}`
  time.className = "time-ms"
  li.append(text, time);
  messagesList.appendChild(li);
  li.scrollIntoView({ behavior: "smooth" });
}

function toggleModal(modal, show) {
  modal.classList.toggle("active", show);
}
