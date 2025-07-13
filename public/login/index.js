const loginBtnEl = document.querySelector(".login")
const loginInptEl = document.querySelector(".username")
const password = document.querySelector(".password")
const errorMsg = document.querySelector(".error")
const msg = document.querySelector(".msg")

loginBtnEl.addEventListener("click", async(event)=>{
    event.preventDefault()
    if(loginInptEl.value && password.value){
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                username: loginInptEl.value,
                password: password.value
            })
            })

           if(response.status === 500){
            errorMsg.textContent = "Failed to login."
           }
           
           if (response.status === 400){
             errorMsg.textContent = "Username and password are required."
           }

           if (response.status === 401){
             errorMsg.textContent = "Wrong login or password"
           }


           if (response.status === 200){
              const data = await response.json()
              errorMsg.style.display = "none"
              msg.textContent = data.msg
              localStorage.setItem("nickname", data.user.username);
              window.location.href = "/chat/"
           }
           

            
    }

})

