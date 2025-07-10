const createBtnEl = document.querySelector(".create")


createBtnEl.addEventListener("click", (event)=>{
    event.preventDefault()

    window.location.href = "/create/"
})