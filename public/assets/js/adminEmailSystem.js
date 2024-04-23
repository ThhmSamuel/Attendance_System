function fetchDataAndPopulateModuleByCohort(cohortName) {  
    return new Promise((resolve, reject) => { 
        fetch('/getModuleByCohort', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({ cohortName }), 
        })
        .then(response => {   
            if (!response.ok) { 
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => { 
            const moduleNames = []; 

            // console.log(data);

            data.forEach(item => {  
                moduleNames.push(item.moduleName); 
            }); 
                
            // Populating the module names based on the semester
            var select = document.getElementById("moduleName-flag"); 
            select.innerHTML = '';

            moduleNames.forEach(function (moduleName) {  
                var option = document.createElement("option"); 
                option.value = moduleName;
                option.text = moduleName;
                select.appendChild(option);
            });

            resolve(data); // Resolve with the fetched data
        }) 
        .catch(error => {
            reject(error); // Reject with the error
        });
    }); 
}                

function fetchDataAndPopulateCohort() { 
    return new Promise((resolve, reject) => {
        fetch('/getAllCohort', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) { 
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const cohortNames = [];  
            
            data.forEach(item => {
                cohortNames.push(item.cohortName);
            }); 
                
            // Populating the module names based on the semester
            var select = document.getElementById("cohort-flag"); 
            // select.innerHTML = '';  

            cohortNames.forEach(function (cohortName) {
                var option = document.createElement("option");
                option.value = cohortName;
                option.text = cohortName;
                select.appendChild(option);
            });

            fetchDataAndPopulateModuleByCohort(cohortNames[0])  

            resolve(data); // Resolve with the fetched data
        }) 
        .catch(error => {
            reject(error); // Reject with the error
        });
    }); 
}

document.getElementById('cohort-flag').addEventListener('change', function() {
    // Get the selected cohort value
    var selectedCohort = this.value; 
    // clearLecturerAttendanceData()   
    fetchDataAndPopulateModuleByCohort(selectedCohort); 
}); 
 



// Sending email part -----------------------------


function sendEmail() {
    fetchStudentAttendanceRate()
        .then(result => {
            var moduleName = document.getElementById("moduleName-flag").value;
            const criticalStudents = result.criticalStudents;
            const promises = []; // Array to store all fetch promises
            const potentialStudent = []; // Array to store potential students

            criticalStudents.forEach(item => {
                studentEmail = item.studentEmail;
                // console.log(studentEmail);

                // Push each fetch promise into the promises array
                const promise = fetch('/getStudentPrevRate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ moduleName, studentEmail }),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => { 
                    // console.log("Item ", item);
                    // console.log("Date ", data);
                    
                    // Check if the student's attendance data is empty or if there's a reduction in attendance rate
                    // example , if the curr attendance of the student is 80 , and previosus attendance is 85 ... we will send email as the attendnace rate reduced 
                    // if the curr and previous is the same , we dont have to send 
                    if (data.length === 0) {
                        potentialStudent.push(item);
                    } else if(item.attendance_rate < data[0].prevAttendanceRate){
                        potentialStudent.push(item);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error); 
                    // Handle the error appropriately
                });

                promises.push(promise); // Push the current promise into the promises array
            });

            // Wait for all promises to resolve
            Promise.all(promises)
                .then(() => {
                    // Now, all fetch requests have completed
                    console.log("Potential Students:", potentialStudent);

                    if (potentialStudent.length === 0) {
                        alert('No students to send email to');
                        return;
                    }

                    var moduleName = document.getElementById("moduleName-flag").value;

                    // console.log(moduleName)
                    fetch('/getModuleID', {
                        method: 'POST', 
                        headers: { 
                            'Content-Type': 'application/json',
                        }, 
                        body: JSON.stringify({moduleName}),   
                    })  
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json(); // Parse the response body as JSON
                    })
                    .then(data => {


                        const moduleID = data[0].moduleID;
                        const randomBatchId = generateBatchId()   
                        const date = todayDate()

                        insertIntoEmailBatch(randomBatchId, moduleID ,date);
                        
                        potentialStudent.forEach(student => { 
                            insertIntoStudentNotification(student.studentEmail, randomBatchId, student.attendance_rate, student.percentage)
                            sendEmailToStudent(student, moduleName);     
                            // console.log(student) 
                        });

                        rePopulateTable() 


                    })
                    .catch(error => {
                        console.error('Error fetching module ID:', error);
                        // Handle the error appropriately
                    }); 


                })
                .catch(error => {
                    console.error('Error fetching data:', error); 
                    // Handle the error appropriately
                });
        })
        .catch(error => {
            console.error("Error fetching student attendance rate:", error);
            // Handle the error appropriately 
        }); 
}  


function insertIntoStudentNotification(studentEmail, emailBatchID, prevAttendanceRate, threshold) {
    // console.log(studentEmail, emailBatchID, prevAttendanceRate, threshold);
    fetch('/insertStudentNotification', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
            studentEmail, emailBatchID, prevAttendanceRate, threshold
        }),
    }) 
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Email Notification sent successfully');
    })
    .catch(error => {
        console.error('Error sending email:', error);
        // Handle the error appropriately
    }); 
}

function generateBatchId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Define the characters to be used in the batch ID

    let batchId = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length); // Generate a random index within the range of the characters array
        batchId += characters.charAt(randomIndex); // Append the character at the random index to the batch ID string
    }
    return batchId;
}



function todayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month (0 for January)
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}   


function sendEmailToStudent(student,moduleName) {  
    // Create fetch request to send email to the student 
    fetch('/sendEmail', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },  
        body: JSON.stringify({
            attendanceRate: student.attendance_rate,
            threshold: student.percentage,  
            email: student.studentEmail,
            moduleName: moduleName 
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
        // Handle the error appropriately
    });
}


function insertIntoEmailBatch(emailBatchID, moduleID, dateTaken) {
    fetch('/insertEmailBatch', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
            emailBatchID, moduleID, dateTaken
        }),
    }) 
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Email Batch sent successfully');
    })
    .catch(error => {
        console.error('Error sending email:', error);
        // Handle the error appropriately
    });
}




function classifyAttendanceRate(attendanceThreshold, studentAttendanceRate){

    if(studentAttendanceRate >= attendanceThreshold){
        return "Good" 
    }else{
        return "Critical"  
    } 
}
 


function fetchStudentAttendanceRate() {
    var moduleName = document.getElementById("moduleName-flag").value;

    return fetch('/getLatestTerm', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(lastestterm => {
        term = lastestterm[0].latest_term;
        return fetch('/getStudentAttendanceRateByModule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ moduleName , term }),
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        threshold = data[0].percentage;
        critical_students = [];

        data.forEach(item => {
            classification = classifyAttendanceRate(threshold, item.attendance_rate);

            if(classification === "Critical"){  
                critical_students.push(item);
            }
        }); 

        return { 
            criticalStudents: critical_students
        };
    })
    .catch(error => {
        console.error(error); // Log the error  
        throw error; // Propagate the error to the outer promise chain
    });
}


function populateTable(){ 
    fetchEmailBatch()
        .then(data => {
            console.log(data);
            setTimeout(function() {
                var table = $('#example').DataTable(); 
                // Clear existing data  
                table.destroy();
                // Map data and create rows 
                data.forEach(item => {
    
                    currDate = (item.dateTaken).split("T")[0]; 

                    const row = `<tr> 
                        <td><a href="#" onclick="openPopup('${item.emailBatchID}')">${item.emailBatchID}</a></td>
                        <td>${item.moduleName}</td>
                        <td>${currDate}</td> 
                    </tr>`;

                    // Add the row to the table
                    table.row.add($(row).get(0));  
                });
                // Redraw the table  
                table.draw();
            }, 100); 
            
        }) 
        .catch(error => {
            console.error('Error fetching student attendance data:', error);
        });
}



function rePopulateTable(){
    fetchEmailBatch()
        .then(data => { 
            console.log(data); 

            setTimeout(function() {
                var table = $('#example').DataTable(); 
                // Clear existing data  
                table.clear(); 
                // Map data and create rows 
                data.forEach(item => {
    
                    currDate = (item.dateTaken).split("T")[0]; 

                    const row = `<tr> 
                        <td><a href="#" onclick="openPopup('${item.emailBatchID}')">${item.emailBatchID}</a></td>
                        <td>${item.moduleName}</td>
                        <td>${currDate}</td> 
                    </tr>`;

                    // Add the row to the table
                    table.row.add($(row).get(0));  
                });
                // Redraw the table  
                table.draw();
            }, 100); 
        }) 
        .catch(error => {
            console.error('Error fetching student attendance data:', error);
        });
}


function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}


function openPopup(emailBatchID) { 
    return new Promise((resolve, reject) => {  
        fetch('/getEmailDetailsByBatchID', {  
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailBatchID }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })   
            .then(data => { 
                console.log(data);
                document.getElementById("moduleLabel").textContent = "Module name : " + data[0].moduleName;
                document.getElementById("dateLabel").textContent = "\nDate taken : " + (data[0].dateTaken).split("T")[0];
 
                setTimeout(function() {

                    var table = $('#example2').DataTable();  
                
                    table.clear();
                
                    data.forEach(item => {
                        
                        const row = `<tr> 
                            <td>${item.name}</td>
                            <td>${item.prevAttendanceRate}</td>
                            <td>${item.threshold}</td>   
                        </tr>`;

                        // Add the row to the table
                        table.row.add($(row).get(0));
                    });

                    // Redraw the table  
                    table.draw();


                }, 100); 

                document.getElementById('popup').style.display = 'block';
                document.getElementById('overlay').style.display = 'block'; 
                resolve(data); // Resolve with the fetched data 
            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    });
} 


function fetchEmailBatch() {
    return fetch('/getEmailBatch', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .catch(error => {
        console.error(error); // Log the error
        throw error; // Propagate the error to the outer promise chain
    });
} 


populateTable();  // Fetch and populate the cohort dropdown
fetchDataAndPopulateCohort();  // Fetch and populate the cohort dropdown
