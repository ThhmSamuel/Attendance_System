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

            var firstURL = window.location.href
            const index = firstURL.indexOf('?'); 

            const secondHalf = firstURL.substring(index + 1);
            
            console.log(email.value)
            window.location.href = "http://127.0.0.1:5000/page/?" + secondHalf +
                                        "&studentEmail=" + encodeURIComponent(email.value);

            
            // window.location.href = "http://127.0.0.1:5000/page/?" + 
            // "sessionID=" + encodeURIComponent(sessionID) +   
            // "&moduleName=" + encodeURIComponent(moduleName) +  
            // "&time=" + encodeURIComponent(timeFrom) + "-to-" + encodeURIComponent(timeTo) + 
            // "&date=" + encodeURIComponent(date) + 
            // "&lecturer=" + encodeURIComponent(lecturerName) 
            // "&studentEmail=" + encodeURIComponent(email.value);  
        }
    })
})  


