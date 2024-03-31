function fetchStudentAttendanceData(){   
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
            console.log(data); 
            
            // var table = document.getElementById("attendanceTable");
            // table.innerHTML = ""; // Clear the table before populating it with new data

            resolve(data); // Resolve with the fetched data
        })
        .catch(error => {
            reject(error); // Reject with the error
        });
    });
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