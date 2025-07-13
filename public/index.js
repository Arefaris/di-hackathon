const registerBtnEl = document.querySelector(".register")
const loginBtnEl = document.querySelector(".login")

registerBtnEl.addEventListener("click", (event)=>{
    event.preventDefault()

    window.location.href = "/reg/"
})

loginBtnEl.addEventListener("click", (event)=>{
    event.preventDefault()

    window.location.href = "/login/"
})