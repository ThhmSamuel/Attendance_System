function changePassword() {
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
                email: userEmail,
                password: newPassword
            }), 
        }) 
        .then(response => {
            if (!response.ok) { 
                throw new Error('Network response was not ok');
            }
            alert('Password updated successfully');
            closePopup() 
        
        })
        .catch(error => {
            console.error('Error updating password:', error);
        });
    } else {
        alert("Passwords do not match");
    } 
}  

function openPopup() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block"; 
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}


function fetchAdminInfo(){
    return new Promise((resolve, reject) => {
        fetch('/getFullAdminData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    });
}


fetchAdminInfo()
.then(data => {
    console.log(data);

    document.getElementById("name").textContent = data[0].name;
    document.getElementById("email").textContent = data[0].email;
    document.getElementById("adminID").textContent = data[0].adminID;
    

})
.catch(error => {
    console.error(error);
});