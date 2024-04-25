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


function fetchStudentInfo(){
    return new Promise((resolve, reject) => {
        fetch('/getFullStudentData', {
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


fetchStudentInfo()
.then(data => {
    console.log(data);

    document.getElementById("name").textContent = data[0].name;
    document.getElementById("email").textContent = data[0].studentEmail;
    document.getElementById("studentID").textContent = data[0].studentID;
    document.getElementById("programmeName").textContent = data[0].programmeName;
    document.getElementById("termName").textContent = data[0].term;
    document.getElementById("semesterName").textContent = data[0].semester;
    document.getElementById("cohortName").textContent = data[0].cohortName;
    

})
.catch(error => {
    console.error(error);
});