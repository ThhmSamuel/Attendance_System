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

            console.log(data);

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
 
fetchDataAndPopulateCohort();  // Fetch and populate the cohort dropdown



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
                console.log(studentEmail);

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
                    console.log("Item ", item);
                    console.log("Date ", data);
                    
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

                    potentialStudent.forEach(student => {
                        sendEmailToStudent(student);
                        console.log(student)
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


function sendEmailToStudent(student) { 
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



// Execution of sending email 






