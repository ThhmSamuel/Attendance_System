form.addEventListener("submit", () => {
    const login = {
        email : email.value,
        password: password.value
    } 
    
    fetch("/api/login" , {
        method: "POST", 
        body: JSON.stringify(login),
        headers: {
            "Content-Type": "application/json" 
        } 
    }).then(res => res.json())
    .then(data => {
        if(data.status == "error"){ 
            console.log(data.error)
        } else {
            console.log(data.success)
            window.location.href = "/";    
        }
    })
})  