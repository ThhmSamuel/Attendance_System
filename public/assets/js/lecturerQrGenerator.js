var initialHeight = 520; // Initial height of the container

var qrcode = new QRCode(document.getElementById("qrcode"), { 
    width: 300,
    height: 300 
});

var intervalID; // Variable to store the interval ID

// Function to execute makeCode every 5 seconds 
function executeMakeCode(moduleName,timeFrom,timeTo,date) {
    intervalID = setInterval(function() {
        makeCode(moduleName,timeFrom,timeTo,date); // Call makeCode function
    }, 20000); // 20000 milliseconds = 20 seconds 
    console.log(intervalID) 
}  


function getLecturerName() {

    return new Promise((resolve, reject) => {  
        fetch('/getLecturerName', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            })
            .then(response => {
                if (!response.ok) {  
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })   
            .then(data => {
                // console.log(data[0].name) 
                resolve(data); // Resolve with the fetched data
            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    });
} 



function checkField(){   

    var moduleName = document.getElementById("moduleName").value;
    var classType = document.getElementById("classType").value; 
    var timeFrom = document.getElementById("timeFrom").value;
    var timeTo = document.getElementById("timeTo").value;
    var date = document.getElementById("date").value; 

    console.log("Check Field : ",moduleName,timeFrom,timeTo,date,classType)

    if (!moduleName || !timeFrom || !timeTo ||  !date  ||  !classType) {      
        alert("Please fill in all fields.");
        return;
    } else {
        
        if((timeFrom === timeTo)){
            alert("Start time and end time must not be the same"); 
        } else {
            generateSessionID(true) 
            .then(sessionID => {
                var classSessionID = sessionID
                document.getElementById('class-SessionID').innerText = "Class Session ID : "+classSessionID; 
                createClassSessionID_database(databaseStartTime,databaseEndTime,moduleName,lecturerName,classSessionID,classType) 
            })
            .catch(error => {
                console.error('Error generating session ID:', error);
            });

            //generate QR code 
            makeCode(moduleName,timeFrom,timeTo,date);
            // Start executing makeCode initially
            executeMakeCode(moduleName,timeFrom,timeTo,date);

            var databaseStartTime = date + ' ' + timeFrom
            var databaseEndTime = date + ' ' + timeTo 
        }
    }    
}

async function createClassSessionID_database(startTime,endTime,moduleName,lecturerName,class_sessionID,classType){
    try {
        // Make a POST request to the server 
        const response = await fetch("/insertClassSession", {  
            method: "POST", 
            headers: {
                "Content-Type": "application/json" // Ensure proper JSON content type 
            },
            body: JSON.stringify({ startTime,endTime,moduleName,lecturerName,class_sessionID,classType }) // Send sessionId as JSON object
        });      

        if (response.ok) {
            // console.log("Class Session Data sent successfully"); 
        } else {
            throw new Error("Failed to send Class Session Data");  
        }
    } catch (error) {
        console.error("Error:", error);     
    }
                
}

async function expireClassSessionID_database(class_sessionID){ 
    try { 
        // Make a POST request to the server 
        const response = await fetch("/expireClassSessionID", {    
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Ensure proper JSON content type 
            },
            body: JSON.stringify({ class_sessionID }) // Send sessionId as JSON object 
        });       

        if (response.ok) {
            console.log("Class Session Data sent successfully");
        } else {
            throw new Error("Failed to send Class Session Data");  
        }
    } catch (error) {
        console.error("Error:", error);     
    }
                
}


async function submitForm() {
    const class_sessionID = document.getElementById("class_sessionID").value; 

    try {
        // Make a POST request to the server 
        const response = await fetch("/submit-form", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Ensure proper JSON content type
            },
            body: JSON.stringify({ lecturerName, moduleName, class_sessionID }) // Send sessionId as JSON object
        });      

        if (response.ok) {
            alert("Attendance has been submitted!");
            console.log("Data sent successfully");
        } else {
            alert("Invalid Class Session ID");  
            throw new Error("Failed to send data"); 
        }
    } catch (error) {
        console.error("Error:", error);     
    }
} 
    

function makeCode(moduleName,timeFrom,timeTo,date) {   
    generateSessionID(false) 
    .then(sessionID => {   
        var url = "http://127.0.0.1:5000/formLogin/?" + 
                    "sessionID=" + encodeURIComponent(sessionID) +  
                    "&moduleName=" + encodeURIComponent(moduleName) +  
                    "&time=" + encodeURIComponent(timeFrom) + "-to-" + encodeURIComponent(timeTo) + 
                    "&date=" + encodeURIComponent(date) + 
                    "&lecturer=" + encodeURIComponent(lecturerName);  

        qrcode.makeCode(url);
        console.log(url);  

        var container = document.querySelector('.container3');
        contentHeight = container.scrollHeight;
        container.style.height = contentHeight + 'px';    
    })

    .catch(error => {
        console.error('Error generating session ID:', error);
    });            
} 
 


function clearFields() {
    document.getElementById("moduleName").value = "";
    document.getElementById("timeFrom").value = ""; 
    document.getElementById("timeTo").value = "";
    document.getElementById("date").value = "";
    document.getElementById("class-SessonID").textContent = ""; 
        
    // Remove the existing QRCode element
    var qrcodeElement = document.getElementById("qrcode");
    qrcodeElement.parentNode.removeChild(qrcodeElement);

    // Recreate the QRCode element
    var newQrCodeElement = document.createElement("div");
    newQrCodeElement.id = "qrcode";
    newQrCodeElement.classList.add("qrcodePlacement");
    document.querySelector(".container3").appendChild(newQrCodeElement);

    // Reinitialize QRCode
    qrcode = new QRCode(newQrCodeElement, {
        width: 300,
        height: 300
    });

    var container = document.querySelector('.container3');
    container.style.height = initialHeight + 'px';

}


function expireSessionID() {
    document.getElementById("class-SessionID").textContent = ""; 
        
    // Remove the existing QRCode element
    var qrcodeElement = document.getElementById("qrcode");
    qrcodeElement.parentNode.removeChild(qrcodeElement);

    // Recreate the QRCode element
    var newQrCodeElement = document.createElement("div");
    newQrCodeElement.id = "qrcode";
    newQrCodeElement.classList.add("qrcodePlacement");
    document.querySelector(".container3").appendChild(newQrCodeElement);

    // Reinitialize QRCode
    qrcode = new QRCode(newQrCodeElement, { 
        width: 300,
        height: 300
    }); 

    var container = document.querySelector('.container3');
    container.style.height = initialHeight + 'px';
}


function generateSessionID(isClassSession) {  
    return new Promise((resolve, reject) => {
    fetch('/getSessionID')
        .then(response => response.json())
        .then(data => {
            if (isClassSession) {
                resolve(data.sessionID.slice(0, 5)); // Resolve with first 5 characters of sessionID
            } else {
                resolve(data.sessionID); // Resolve with the full sessionID 
            }
        })
        .catch(error => { 
            console.error('Error fetching session ID:', error);
            reject(error); // Reject the promise if there is an error
        });
    });
}   


// Example button click event listener 
document.getElementById("expireButton").addEventListener("click", function() { 
    const class_sessionID = document.getElementById("class-SessionID").innerText;

    const parts = class_sessionID.split(":");  
    const lastWord = parts[1].trim(); 
    
    expireClassSessionID_database(lastWord) 

    clearInterval(intervalID);
    expireSessionID();

    fetch('/clearActiveSessionIDs', {
        method: 'POST'
    }) 
    .then(response => {
        if (response.ok) {
        console.log('Active session IDs cleared successfully.');
        } else {
        console.error('Failed to clear active session IDs.');
        }
    })
    .catch(error => {
        console.error('Error clearing active session IDs:', error);
    });
});


document.getElementById("generateQR").addEventListener("click", function() {
    clearInterval(intervalID);    
    console.log("hello") 
    checkField(); 
}); 


function fetchDataAndPopulateModuleDropdown(){
    return new Promise((resolve, reject) => {
        fetch('/lecturerModuleData', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }), 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })   
        .then(data => {
            var select = document.getElementById("moduleName");

            data.forEach(item => { 
                var option = document.createElement("option"); 
                option.value = item.moduleName;
                option.text = item.moduleName;  
                select.appendChild(option);
            });

            resolve(data); // Resolve with the fetched data
        })
        .catch(error => {
            reject(error); // Reject with the error
        }); 
    });
}

var lecturerName;

async function setLecturerName() {
    try {
        const data = await getLecturerName(); 
        lecturerName = data[0].name; 
        console.log(lecturerName); 
        return lecturerName; 
    } catch (error) {
        console.error('Error:', error); 
    }
}

setLecturerName();
fetchDataAndPopulateModuleDropdown() 