const createBtnEl = document.querySelector(".create")
const joinBtnEl = document.querySelector(".join")

createBtnEl.addEventListener("click", (event)=>{
    event.preventDefault()

    window.location.href = "/create/"
})

joinBtnEl.addEventListener("click", (event)=>{
    event.preventDefault()

    window.location.href = "/join/"
})