const socket = io();
const nickname = localStorage.getItem("nickname");
let currentRoom = "";

//DOM Elements
const form = document.getElementById("form");
const input = document.getElementById("input");
const messagesList = document.getElementById("messages");
const chatsEl = document.querySelector(".chats");

const modalJoin = document.getElementById("modal-join");
const modalCreate = document.getElementById("modal-create");

const openJoinBtn = document.querySelector(".open-join-modal");
const openCreateBtn = document.querySelector(".open-create-modal");
const closeBtns = document.querySelectorAll(".close-btn");

const joinRoomInput = document.getElementById("join-room-input");
const createRoomInput = document.getElementById("create-room-input");

const confirmJoinBtn = document.querySelector(".confirm-join");
const confirmCreateBtn = document.querySelector(".confirm-create");

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
    socket.once("created", () => location.reload());
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

//Rendering
function renderChats(chats) {
  chatsEl.innerHTML = "";
  chats.forEach(({ name, guid }) => {
    const room = document.createElement("div");
    room.classList.add("room");
    room.textContent = name;
    room.addEventListener("click", () => {
      currentRoom = guid;
      socket.emit("join", { roomID: guid });
    });
    chatsEl.appendChild(room);
  });
}

function appendChatIfNotExists(chat) {
  const exists = [...document.querySelectorAll(".room")].some(room =>
    room.textContent === chat.name
  );
  if (!exists) {
    const room = document.createElement("div");
    room.classList.add("room");
    room.textContent = chat.name;
    room.addEventListener("click", () => {
      currentRoom = chat.guid;
      socket.emit("join", { roomID: chat.guid });
    });
    chatsEl.appendChild(room);
  }
}


function renderMessages(messages) {
  messages.forEach(renderMessage);
}

function renderMessage({ sender, message }) {
  const li = document.createElement("li");
  li.className = sender === nickname ? "msgcont-me" : "msgcont-other";

  const name = document.createElement("div");
  name.textContent = sender;
  const text = document.createElement("div");
  text.textContent = message;

  li.append(name, text);
  messagesList.appendChild(li);
  li.scrollIntoView({ behavior: "smooth" });
}

function toggleModal(modal, show) {
  modal.classList.toggle("active", show);
}
