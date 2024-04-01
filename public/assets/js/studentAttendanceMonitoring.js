function fetchStudentAttendanceData() {
    var moduleName = document.getElementById("moduleName").value; 
    var monthYear = document.getElementById("monthYear").value;
    var attendanceStatus = document.getElementById("attendanceStatus").value;

    return new Promise((resolve, reject) => {
        fetch('/studentAttendanceData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, moduleName, attendanceStatus, monthYear }),
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
document.getElementById("showDataBtn").addEventListener("click", function() {
    fetchStudentAttendanceData()
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


function fetchDataAndPopulateDropdowns(options) { 
    return new Promise((resolve, reject) => {
        fetch('/studentModuleData', options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const moduleNames = []; 
                const startMonths = [];
                const endMonths = [];

                data.forEach(item => {
                    moduleNames.push(item.moduleName);
                    startMonths.push(item.startMonth);
                    endMonths.push(item.endMonth);
                });

                // Populating the month and year based on the semester
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var select = document.getElementById("monthYear");

                var startMonth = startMonths[0];
                var endMonth = endMonths[0];

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