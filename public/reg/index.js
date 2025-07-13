const regBtnEl = document.querySelector(".reg")
const loginInptEl = document.querySelector(".username")
const password = document.querySelector(".password")
const errorMsg = document.querySelector(".error")
const msg = document.querySelector(".msg")

regBtnEl.addEventListener("click", async(event)=>{
    event.preventDefault()
    if(loginInptEl.value && password.value){
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                username: loginInptEl.value,
                password: password.value
            })
            })
           
           if (response.status === 409){
             errorMsg.textContent = "This user already exist"
           }

           if (response.status === 201){
            const data = await response.json()
            errorMsg.style.display = "none"
            msg.textContent = data.msg
            window.location.href = "/chat/"
            
           }
            
    }

})

