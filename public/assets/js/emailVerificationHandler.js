function sendOTP(){
    console.log("sendOTP")
    email = document.getElementById("email").value

    fetchRoleID(email)
    .then(data => {
        console.log(data)

        if(data.length === 0){
            alert("Email not registered. Please contact admin for more information.")
            return  
        }
        
        document.getElementById("containerOTP").style.display = "block" 
        document.getElementById("login-container").style.display = "none" 
 
        generateOTPs()
        sendEmailForgotPassword(email,OTP)  
 
    })    
}  

function fetchRoleID(email) {
    return new Promise((resolve, reject) => {  
        fetch('/getRoleID', {  
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ email }),   
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })   
            .then(data => {
                resolve(data); // Resolve with the fetched data
            })
            .catch(error => {
                reject(error); // Reject with the error
            });  
    }); 
} 


function sendEmailForgotPassword(email,otp) {  
    // Create fetch request to send email to the student  
    fetch('/sendEmailForgotPassword', {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json', 
        },  
        body: JSON.stringify({ 
            email,
            otp  
        }), 
    }) 
    .then(response => {
        if (!response.ok) { 
            throw new Error('Network response was not ok');
        }
        console.log('Email sent successfully');
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });
}


// OTP processes  

var OTP = ""
var expireInterval = "";  

var inputs = document.querySelectorAll('input[type="number"]');
var otpVerifyButton = document.getElementById("opt-verification")  
var emailID = document.getElementById("email-span")
var expire = document.getElementById("expire") 


function generateOTPs(){
    emailID.innerText = document.getElementById("email").value;
    OTP =  
        Math.floor(Math.random() * 10) + 
        "" +
        Math.floor(Math.random() * 10) +
        "" +
        Math.floor(Math.random() * 10) +
        "" +
        Math.floor(Math.random() * 10);

    // alert("Your OTP is: " + OTP);  

    inputs[0].focus();
    expire.innerText = 40;  

    expireInterval = setInterval(function(){
        expire.innerText--; 
        if(expire.innerText == 0) {
            clearInterval(expireInterval);
            expire.innerText = 0; // Use assignment operator to set expire.innerText to 0
        }
    }, 1000);
}

function clearOTPs(){
    inputs.forEach((input, i) => {
        input.value="";
        if(i == 0){
            input.removeAttribute("disabled");
        }
        if(i != 0){
            input.setAttribute("disabled", true);
        }
    });
    clearInterval(expireInterval);
    expire.innerText = 0;
    otpVerifyButton.classList.remove("active");
}

inputs.forEach((input,index)=>{
    input.addEventListener("keyup",function(e){
        const currentInput = input,
        nextInput = input.nextElementSibling, 
        prevInput = input.previousElementSibling;


        if(nextInput && nextInput.hasAttribute("disabled") && currentInput.value!==""){
            nextInput.removeAttribute("disabled", true);
            nextInput.focus();
        }
 
        if(e.key === "Backspace"){
            inputs.forEach((input, index1)=>{
                if(index <= index1 && prevInput) {
                    input.setAttribute("disabled", true);
                    prevInput.focus();
                    prevInput.value = "";
                } 
            });
        }

        if(inputs[3].disabled && inputs[3].value!==""){
            inputs[3].blur();
            otpVerifyButton.classList.add("active");
            return;
        }
        otpVerifyButton.classList.remove("active");
    });
}); 
 


otpVerifyButton.addEventListener("click", ()=> { 
    let verify = "";

    inputs.forEach((input)=>{
        verify += input.value;
    });

    console.log(verify)
    console.log(OTP) 

    if(verify===OTP && expire.innerText > 0){ 
        alert("Your account has been verified successfully!");
        clearOTPs(); 
        document.getElementById("containerOTP").style.display = "none" 
        document.getElementById("resetPassword").style.display = "block" 
    }else{
        alert("Your Verification Failed!"); 
    } 
});
 

function reSendOTP(){
    generateOTPs();
    sendEmailForgotPassword(emailID.innerText,OTP);
} 


function updatePassword(){ 
    var newPassword = document.getElementById("new-password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    console.log(newPassword)
    console.log(confirmPassword)

    if(newPassword === confirmPassword){
        fetch('/updatePassword', {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json', 
            },  
            body: JSON.stringify({ 
                email: emailID.innerText,
                password: newPassword
            }), 
        }) 
        .then(response => {
            if (!response.ok) { 
                throw new Error('Network response was not ok');
            }
            alert('Password updated successfully');
            window.location.href = "/"; 
        })
        .catch(error => {
            console.error('Error updating password:', error);
        });
    } else {
        alert("Passwords do not match");
    } 

}