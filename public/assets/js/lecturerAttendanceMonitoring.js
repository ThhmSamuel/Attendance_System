function fetchLecturerAttendanceData() {
    var moduleName = document.getElementById("moduleName").value; 
    var monthYear = document.getElementById("monthYear").value;

    return new Promise((resolve, reject) => {  
        fetch('/lecturerAttendanceData', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, moduleName, monthYear }),
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

document.getElementById("showDataBtn").addEventListener("click", function() {
    fetchLecturerAttendanceData()
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

function updateStudentAttendance() {  
    const studentEmail = document.getElementById("studentSelection").value; 
    const status = document.getElementById("attendanceStatus").value;

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



function clearLecturerAttendanceData() {  
    //to clear the content within the datatable
    const tableBody = document.getElementById("lecturer-attendance-table");
    tableBody.innerHTML = "";

    //to clear the datatable's data
    var table = $('#example').DataTable();
    table.clear();
    table.draw();

    //to reset the fields in the form 
    var moduleNameSelect = document.getElementById("moduleName");
    var monthYearSelect = document.getElementById("monthYear");
 
    moduleNameSelect.value = "All";
    monthYearSelect.value = "All";
}  


function fetchDataAndPopulateDropdowns(options) { 
    return new Promise((resolve, reject) => {
        fetch('/lecturerModuleData', options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const moduleNames = [];

                data.forEach(item => {
                    moduleNames.push(item.moduleName);
                });

                // Populating the month and year based on the semester
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var select = document.getElementById("monthYear");

                var startMonth = '2024-1';
                var endMonth = '2024-6'; 

                var startYear = parseInt(startMonth.substring(0, 4));
                var endYear = parseInt(endMonth.substring(0, 4));
                var startMonthNumber = parseInt(startMonth.substring(5));
                var endMonthNumber = parseInt(endMonth.substring(5));

                for (var year = startYear; year <= endYear; year++) {
                    for (var month = (year === startYear ? startMonthNumber : 1);
                        month <= (year === endYear ? endMonthNumber : 12);
                        month++) {
                        var value = year + "-" + ("0" + month).slice(-2);
                        var text = months[month - 1] + " " + year;
                        var option = document.createElement("option");
                        option.value = value;
                        option.text = text;
                        select.appendChild(option);
                    }
                } 

                // Populating the module names based on the semester
                var select = document.getElementById("moduleName");

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
 

fetchDataAndPopulateDropdowns({ 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: userEmail }), 
})
.then(data => {
    console.log(data); // Access the fetched data if needed
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});


var currSessionID; 