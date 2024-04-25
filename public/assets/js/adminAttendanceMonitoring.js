function fetchDataAndPopulateModuleByStudentID(studentID) { 
    return new Promise((resolve, reject) => {
        fetch('/studentModuleData', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: studentID+"@soton.ac.uk" }), 
        })
        .then(response => {
            if (!response.ok) { 
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            clearStudentAttendanceData();
            const moduleNames = []; 
 
            data.forEach(item => { 
                moduleNames.push(item.moduleName); 
            }); 
                
            // Populating the module names based on the semester
            var select = document.getElementById("moduleName");
            select.innerHTML = '';

            var option = document.createElement("option");
            option.value = "All";
            option.text = "All";
            select.appendChild(option);

            moduleNames.forEach(function (moduleName) {
                var option = document.createElement("option");
                option.value = moduleName;
                option.text = moduleName;
                select.appendChild(option);
            });

            toggleContainer1Visibility();

            var table = $('#example').DataTable(); 
            table.clear(); 
            table.draw();

            resolve(data); // Resolve with the fetched data
        }) 
        .catch(error => {
            reject(error); // Reject with the error
        });
    }); 
} 

 
function fetchStudentAttendanceData(studentID) {
    var moduleName = document.getElementById("moduleName").value; 
    var monthYear = document.getElementById("monthYear").value;
    var attendanceStatus = document.getElementById("attendanceStatus").value;

    return new Promise((resolve, reject) => {
        fetch('/studentAttendanceData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: studentID+"@soton.ac.uk", moduleName, attendanceStatus, monthYear }),
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
 
// Event listener for the "Show Data" button
document.getElementById("showDataByStudentBtn").addEventListener("click", function() { 
    fetchStudentAttendanceData(document.getElementById('studentID').value)
        .then(data => {
            var table = $('#example').DataTable();
            // Clear existing data
            table.clear();
            // Map data and create rows
            data.forEach(item => {
                const startDate = new Date(item.startTime);
                const endDate = new Date(item.endTime);
                const startDateString = startDate.toLocaleDateString();
                const startTimeString = startDate.toLocaleTimeString();
                const endTimeString = endDate.toLocaleTimeString();
        
                const row = `<tr> 
                    <td>${item.moduleName}</td>
                    <td>${item.classType}</td>
                    <td>${item.status}</td>
                    <td>${startDateString}</td>
                    <td>${startTimeString}</td>
                    <td>${endTimeString}</td>
                </tr>`;
                // Add the row to the table
                table.row.add($(row).get(0));
            });
            // Redraw the table 
            table.draw();
        }) 
        .catch(error => {
            console.error('Error fetching student attendance data:', error);
        });
});


function clearStudentAttendanceData() {
    //to clear the content within the datatable
    const tableBody = document.getElementById("student-attendance-table");
    tableBody.innerHTML = "";
  
    //to clear the datatable's data
    var table = $('#example').DataTable();
    table.clear(); 
    table.draw();

    //to reset the fields in the form 
    var moduleNameSelect = document.getElementById("moduleName");
    var monthYearSelect = document.getElementById("monthYear");
    var attendanceStatusSelect = document.getElementById("attendanceStatus");

    moduleNameSelect.value = "All";
    monthYearSelect.value = "All";
    attendanceStatusSelect.value = "All";
}  

  
function toggleContainer1Visibility() {
    var moduleNameSelect = document.getElementById("moduleName");
    var container1 = document.querySelector(".container1");

    // Check if the select element has more than one option
    if (moduleNameSelect.options.length > 1) {
        container1.style.display = "block";
    } else {
        alert("Student does not exist");
        container1.style.display = "none";
    }
}

document.getElementById('studentID').addEventListener('input', function() {
    // Hide container1 if the user change the value , only show if they click search button 
    var container1 = document.querySelector(".container1");
    container1.style.display = "none";
});


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
            var select = document.getElementById("cohort");
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


function activateByStudent(){ 
    document.getElementById('by-student-container').style.display = 'block';
    document.getElementById('by-class-container').style.display = 'none'; 
  
    document.getElementById('student-attendanceBtn').classList.add('highlight');  
    document.getElementById('class-attendanceBtn').classList.remove('highlight');
} 



function activateByClass(){  
    document.getElementById('by-student-container').style.display = 'none';
    document.getElementById('by-class-container').style.display = 'block'; 
  
    document.getElementById('student-attendanceBtn').classList.remove('highlight');  
    document.getElementById('class-attendanceBtn').classList.add('highlight'); 
} 

// activateByClass
 
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
            var select = document.getElementById("moduleName-byClass"); 
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

function fetchLecturerAttendanceData() {
    var moduleName = document.getElementById("moduleName-byClass").value; 
    var monthYear = document.getElementById("monthYear-byClass").value;

    return new Promise((resolve, reject) => {  
        fetch('/lecturerAttendanceData', { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ email : 'None' , moduleName, monthYear }),   
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })   
            .then(data => {
                console.log(data);
                resolve(data); // Resolve with the fetched data
            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    }); 
} 

document.getElementById("showDataByClassBtn").addEventListener("click", function() {
    fetchLecturerAttendanceData()
        .then(data => {
            var table = $('#example3').DataTable();
            // Clear existing data 
            table.clear();
            // Map data and create rows 
            data.forEach(item => {
                const startDate = new Date(item.startTime);
                const endDate = new Date(item.endTime);
                const startDateString = startDate.toLocaleDateString();
                const startTimeString = startDate.toLocaleTimeString();
                const endTimeString = endDate.toLocaleTimeString();
        
            
                const row = `<tr> 
                    <td>${item.moduleName}</td>
                    <td>${item.classType}</td>
                    <td>${startDateString}</td>
                    <td>${startTimeString}</td>
                    <td>${endTimeString}</td>
                    <td><a href="#" onclick="openPopup('${item.classSessionID}')">${item.classSessionID}</a></td>
                    <td>
                        <button onclick="deleteSessionID('${item.classSessionID}')" class="delete-button">Delete</button> 
                    </td>
                </tr>`;

                // Add the row to the table
                table.row.add($(row).get(0));
            });
            // Redraw the table  
            table.draw();
        }) 
        .catch(error => {
            console.error('Error fetching student attendance data:', error);
        });
});


function openPopup(class_session_id) {  
 
    currSessionID = class_session_id;
    
    return new Promise((resolve, reject) => {   
        fetch('/classAttendanceData', {  
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ class_session_id }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })   
            .then(data => {

                var table = $('#example2').DataTable();  
                
                // Clear existing data
                table.clear();

                var absentCount = 0;
                var presentCount = 0;

                // Map data and create rows
                data.forEach(item => {
                    const startDate = new Date(item.startTime);
                    const endDate = new Date(item.endTime);
                    const startDateString = startDate.toLocaleDateString();
                    const startTimeString = startDate.toLocaleTimeString();
                    const endTimeString = endDate.toLocaleTimeString();

                    const row = `<tr> 
                        <td>${item.name}</td>
                        <td>${item.status}</td>
                        <td>${startDateString}</td>
                        <td>${startTimeString}</td>
                        <td>${endTimeString}</td>
                        <td>${item.classSessionID}</td> 
                        <td>${item.moduleName}</td>
                        <td>${item.classType}</td>  
                    </tr>`;

                    if(item.status == 'Present'){
                        presentCount++;
                    }else{
                        absentCount++; 
                    }

                    // Add the row to the table
                    table.row.add($(row).get(0));
                });

                // Redraw the table  
                table.draw();

                document.getElementById('presentCount').innerHTML  = presentCount; 
                document.getElementById('absentCount').innerHTML  = absentCount;
                document.getElementById('attendee-percentage').innerHTML  = ((presentCount/(absentCount+presentCount)) * 100) + '%';   

                document.getElementById('popup').style.display = 'block';
                document.getElementById('overlay').style.display = 'block'; 
                resolve(data); // Resolve with the fetched data 
            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    });

}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none'; 
}


function clearLecturerAttendanceData() { 
    //to clear the content within the datatable
    const tableBody = document.getElementById("lecturer-attendance-table");
    tableBody.innerHTML = "";

    //to clear the datatable's data
    var table = $('#example3').DataTable(); 
    table.clear();
    table.draw();

    //to reset the fields in the form 
    var monthYearSelect = document.getElementById("monthYear-byClass"); 
    monthYearSelect.value = "All"; 
}  


document.getElementById('cohort').addEventListener('change', function() {
    // Get the selected cohort value
    var selectedCohort = this.value;
    console.log(selectedCohort); 
    clearLecturerAttendanceData()  
    fetchDataAndPopulateModuleByCohort(selectedCohort);
});



fetchDataAndPopulateCohort()




function updateStudentAttendance() {  
    const studentEmail = document.getElementById("studentSelection").value; 
    const status = document.getElementById("attendanceStatusStudent").value;

    console.log(currSessionID, studentEmail, status)
 
    fetch('/updateStudentAttendance', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currSessionID, studentEmail, status }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');        
            }
            return response.json();
        })
        .then(data => { 
            alert("Student attendance updated successfully!")
            reupdateAttendanceTable();
        })
        .catch(error => { 
            console.error('There was a problem with the fetch operation:', error);
        });
}

 
function reUpdateMainAttendanceTable(){ 
    fetchLecturerAttendanceData() 
        .then(data => {

            var table = $('#example3').DataTable();
            // Clear existing data 
            table.clear();
            // Map data and create rows
            data.forEach(item => {
                const startDate = new Date(item.startTime);
                const endDate = new Date(item.endTime);
                const startDateString = startDate.toLocaleDateString();
                const startTimeString = startDate.toLocaleTimeString();
                const endTimeString = endDate.toLocaleTimeString();
        
                const row = `<tr> 
                    <td>${item.moduleName}</td>
                    <td>${item.classType}</td>
                    <td>${startDateString}</td>
                    <td>${startTimeString}</td>
                    <td>${endTimeString}</td>
                    <td><a href="#" onclick="openPopup('${item.classSessionID}')">${item.classSessionID}</a></td>
                    <td>
                        <button onclick="deleteSessionID('${item.classSessionID}')" class="delete-button">Delete</button>
                    </td>
                </tr>`;

                // Add the row to the table
                table.row.add($(row).get(0));
            });
            // Redraw the table  
            table.draw();
        }) 
        .catch(error => {
            console.error('Error fetching student attendance data:', error);
        });
}



function removeClassSessionID(classSessionID) { 
    console.log("removeClassSessionID")
    return new Promise((resolve, reject) => {  
        fetch('/removeClassSessionID', {  
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ classSessionID }), 
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



function removeAttendanceData(classSessionID) { 
    console.log("removeAttendanceData")
    return new Promise((resolve, reject) => {  
        fetch('/removeAttendanceData', { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ classSessionID }), 
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
 


function deleteSessionID(classSessionID) {
    var confirmation = window.confirm("Are you sure you want to delete this session?");
 
    if (confirmation) {
        console.log(classSessionID);
        removeClassSessionID(classSessionID); 
        removeAttendanceData(classSessionID); 
        reUpdateMainAttendanceTable(); 
    }
}


var currSessionID; 


function reupdateAttendanceTable(){  
    return new Promise((resolve, reject) => {  
        fetch('/classAttendanceData', {  
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ class_session_id : currSessionID }),
            })
            .then(response => { 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                } 
                return response.json();
            })   
            .then(data => {
                // console.log(data);


                var table = $('#example2').DataTable();  
                
                // Clear existing data
                table.clear();

                var absentCount = 0;
                var presentCount = 0;
                
                // Map data and create rows
                data.forEach(item => {
                    const startDate = new Date(item.startTime);
                    const endDate = new Date(item.endTime);
                    const startDateString = startDate.toLocaleDateString();
                    const startTimeString = startDate.toLocaleTimeString();
                    const endTimeString = endDate.toLocaleTimeString();

                    const row = `<tr> 
                        <td>${item.name}</td>
                        <td>${item.status}</td>
                        <td>${startDateString}</td>
                        <td>${startTimeString}</td>
                        <td>${endTimeString}</td>
                        <td>${item.classSessionID}</td>
                        <td>${item.moduleName}</td>
                        <td>${item.classType}</td> 
                    </tr>`;

                    if(item.status == 'Present'){
                        presentCount++;
                    }else{
                        absentCount++; 
                    }

                    // Add the row to the table
                    table.row.add($(row).get(0));
                });

                // Redraw the table  
                table.draw();


                document.getElementById('presentCount').innerHTML  = presentCount; 
                document.getElementById('absentCount').innerHTML  = absentCount;
                document.getElementById('attendee-percentage').innerHTML  = ((presentCount/(absentCount+presentCount)) * 100) + '%';   


                document.getElementById('popup').style.display = 'block';
                document.getElementById('overlay').style.display = 'block'; 
                resolve(data); // Resolve with the fetched data 
            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    });
}


function activateByView(){ 
    document.getElementById('container4').style.display = 'none';
    document.getElementById('student-attendance-container').style.display = 'block'; 
  
    document.getElementById('view-attendanceBtn').classList.add('highlight');  
    document.getElementById('update-attendanceBtn').classList.remove('highlight');
    console.log('activateByView')
} 



function activateByUpdate(){  
    document.getElementById('container4').style.display = 'block';
    document.getElementById('student-attendance-container').style.display = 'none'; 
  
    document.getElementById('view-attendanceBtn').classList.remove('highlight');   
    document.getElementById('update-attendanceBtn').classList.add('highlight'); 


    return new Promise((resolve, reject) => {  
        fetch('/classAttendanceData', {  
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',     
                },
                body: JSON.stringify({ class_session_id : currSessionID }),
            })
            .then(response => { 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })   
            .then(data => { 

                var select = document.getElementById("studentSelection");
                select.innerHTML = ""; 
                data.forEach(function(item) {
                    var option = document.createElement("option");
                    option.value = item.studentEmail;
                    option.text = item.name; 
                    select.appendChild(option);
                });
                

            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    });


} 