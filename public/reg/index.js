const regBtnEl = document.querySelector(".reg")
const loginInptEl = document.querySelector(".username")
const password = document.querySelector(".password")
const errorMsg = document.querySelector(".error")
const msg = document.querySelector(".msg")
// logout
regBtnEl.addEventListener("click", async(event)=>{
    event.preventDefault()
    if(loginInptEl.value && password.value){
        fetch("/logout", {
                method: "POST",
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json', 
                },
            })
            
        const response = await fetch("/register", {
            method: "POST",
            credentials: 'include',
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
            localStorage.setItem("nickname",  data.user.username);
            setTimeout(() => {
                window.location.href = "/"
            }, 3000);
            
            
           }
            
    }

})

