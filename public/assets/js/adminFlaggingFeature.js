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


function fetchDataAndPopulateTerm(){
    return new Promise((resolve, reject) => {
        fetch('/getAllTerm', {   
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
            const termNames = [];  
            
            data.forEach(item => {
                termNames.push(item.term);
            });  
                
            // Populating the module names based on the semester
            var select = document.getElementById("term-flag"); 
            select.innerHTML = '';  

            termNames.forEach(function (termName) {
                var option = document.createElement("option");
                option.value = termName; 
                option.text = termName;
                select.appendChild(option);
            });

            resolve(data); // Resolve with the fetched data
        }) 
        .catch(error => {
            reject(error); // Reject with the error
        });
    }); 
} 

function classifyAttendanceRate(attendanceThreshold, studentAttendanceRate){

    excellent_rate = 100 - ((100 - attendanceThreshold) * 0.25)
    good_rate =  100 - ((100 - attendanceThreshold) * 0.5)
    critical_rate =  100 - ((100 - attendanceThreshold) * 0.75) 

    if(studentAttendanceRate >= excellent_rate){
        return "Excellent"
    }else if(studentAttendanceRate >= good_rate){
        return "Good"
    }else if(studentAttendanceRate >= critical_rate){
        return "Critical" 
    }else{
        return "Exceeded threshold"  
    } 
}

 
var flagChart;
function fetchStudentAttendanceRate() {

    var moduleName = document.getElementById("moduleName-flag").value; 
    var term = document.getElementById("term-flag").value;

    return new Promise((resolve, reject) => {  
        fetch('/getStudentAttendanceRateByModule', { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ moduleName , term }),   
            })
            .then(response => {
                if (!response.ok) { 
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })   
            .then(data => {

                threshold = data[0].percentage;
                total_sessions = data[0].totalSessions; 

                document.querySelector('.flag-result').textContent = `Attendance threshold for ${moduleName} is ${threshold}% and total sessions is ${total_sessions}.`;

                var table = $('#example3').DataTable();
                
                // Clear existing data 
                table.clear(); 
                 
                // Map data and create rows 
                data.forEach(item => {  
                    const classification = classifyAttendanceRate(threshold,item.attendance_rate);
                    console.log(classification);
                    const row = `<tr class="${classification.replace(/\s+/g, '_').toLowerCase()}">  
                        <td>${item.name}</td>
                        <td>${item.attendance_rate}</td> 
                        <td>${item.absence}</td> 
                        <td>${classification}</td> 
                    </tr>`;

                    // Add the row to the table
                    table.row.add($(row).get(0));
                });
                // Redraw the table  
                table.draw();


                // Creating a chart 
                const classifications = ["Excellent", "Good", "Critical", "Exceeded threshold"];
                const counts = [0, 0, 0, 0];
                data.forEach(item => {
                    const classification = classifyAttendanceRate(threshold, item.attendance_rate);
                    const index = classifications.indexOf(classification);
                    if (index !== -1) {
                        counts[index]++;
                    }
                });

                // Create the chart
                flagChart = new Chart("flagChart", {
                    type: "pie",
                    data: {
                        labels: classifications,
                        datasets: [{
                            backgroundColor: ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9"],
                            data: counts
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: "Attendance Classification"
                        }
                    }
                }); 

                resolve(data); // Resolve with the fetched data
            })
            .catch(error => {
                reject(error); // Reject with the error
            }); 
    }); 
} 

function clearFlaggingData() { 
    //to clear the content within the datatable
    const tableBody = document.getElementById("flagging-table");
    tableBody.innerHTML = ""; 

    //to clear the datatable's data
    var table = $('#example3').DataTable(); 
    table.clear();
    table.draw();

    var termSelect = document.getElementById("term-flag"); 
    termSelect.value = termSelect.options[0].value; 
 
    document.querySelector('.flag-result').textContent = "";

    if(flagChart){
        flagChart.destroy(); 
    }

}  



document.getElementById('cohort-flag').addEventListener('change', function() {
    // Get the selected cohort value
    var selectedCohort = this.value; 
    // clearLecturerAttendanceData()   
    fetchDataAndPopulateModuleByCohort(selectedCohort); 
}); 


fetchDataAndPopulateCohort();  // Fetch and populate the cohort dropdown
fetchDataAndPopulateTerm();  // Fetch and populate the term dropdown 