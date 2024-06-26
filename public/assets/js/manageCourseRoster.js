
document.getElementById('addStudentForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log("check")
    const name = document.getElementById('name').value;
    const studentId = document.getElementById('studentId').value;
    //const PAT_ID = document.getElementById('PAT_ID').value;
    const studentEmail = document.getElementById('studentEmail').value;
    const cohortId = document.getElementById('cohortId').value;
    const termId = document.getElementById('termId').value;

    try {
        
        const response = await fetch('/addStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, studentId, studentEmail, cohortId, termId })
        });
        
        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            document.getElementById('name').value = '';
            document.getElementById('studentId').value = '';
            //document.getElementById('PAT_ID').value = '';
            document.getElementById('studentEmail').value = '';
            document.getElementById('cohortId').value = '';
            document.getElementById('termId').value = '';
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('There was an error!', error);
        alert('An error occurred, please try again');
    }
});


document.getElementById('updateStudentForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const updateStudentId = document.getElementById('updateStudentId').value;
    const updateCohortId = document.getElementById('updateCohortId').value;
    const updateTermId = document.getElementById('updateTermId').value;

    try {
        const response = await fetch('/updateStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cohortId: updateCohortId, termId: updateTermId, studentId: updateStudentId })
        });
        
        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            document.getElementById('updateStudentId').value = '';
            document.getElementById('updateCohortId').value = '';
            document.getElementById('updateTermId').value = '';
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('There was an error!', error);
        alert('An error occurred, please try again');
    }
});

// add student option selection for cohortId
$(document).ready(function() {
    $.get('/populateOption', function(data) {
      data.forEach(function(option) {
        $('#cohortId').append(`<option value="${option.cohortId}">${option.cohortName}</option>`);
      });
    });
  });

// update student option selection for cohortId
$(document).ready(function() {
    $.get('/populateOption', function(data) {
      data.forEach(function(option) {
        $('#updateCohortId').append(`<option value="${option.cohortId}">${option.cohortName}</option>`);
      });
    });
  });
  
  // add student option selection for termId
  $(document).ready(function() {
    $.get('/populateTerm', function(data) {
      data.forEach(function(option) {
        const termName = `${option.startMonth} - ${option.endMonth}`;
        $('#termId').append(`<option value="${option.termID}">${termName}</option>`);
      });
    });
  });


// update student option selection for termId
$(document).ready(function() {
    $.get('/populateTerm', function(data) {
      data.forEach(function(option) {
        const termName = `${option.startMonth} - ${option.endMonth}`;
        $('#updateTermId').append(`<option value="${option.termID}">${termName}</option>`);
      });
    });
  });


//
// DATA INSERTION PART
//
document.getElementById('readButton').addEventListener('click', automaticInsertion);

function handleFile(fileInput, termID) { 
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming there's only one sheet in the Excel file
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON format   
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        console.log(jsonData);
        jsonData.forEach(item => { 
                 
            var currentCohort;

            if(item.Yr === 0){ 
                currentCohort = (item.Programmes).toLowerCase().trim(); 
            } else { 
                currentCohort = ((item.Programmes).trim() + ' ' + 'Y' + item.Yr).toLowerCase(); 
                console.log(currentCohort) 
            }
            
            fetchCohortID(currentCohort)
            .then(data => {

                var name = item.Name; 
                var studentID = item["ID No."];
                var cohortID = data[0].cohortID; 
                var studentEmail = item["Email ID"]; 


                fetch('/insertStudentData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({  name, studentID, studentEmail, cohortID, termID  }) 
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {

                    var password = "123" 
                    var email = studentEmail
                    var roleID = 3

                    fetch('/insertLoginCredential', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({  email, password, roleID  })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
    
                        console.log(data)   
    
                    }) 
                    .catch(error => {
                        console.error('There has been a problem with your fetch operation:', error);
                    })

                }) 
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                })

            })

        }); 
        
    };

    reader.readAsArrayBuffer(file);
}


function automaticInsertion(){
    const fileInput = document.getElementById('fileInput');
    const term = document.getElementById('term').value;
    const semester = document.getElementById('semester').value; 

    // console.log(term, semester); 

    if(fileInput.files.length === 0 || term === '' || semester === '') {
        alert('Please select a file and choose a term and semester');
        return;
    } else {
        fetchTermID(term , semester)
        .then(data => {
            
            handleFile(fileInput, data[0].termID);

        });  
    }

}


function fetchDataAndPopulateTerm() { 
    return new Promise((resolve, reject) => {
        fetch('/getTerm', {  
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

            console.log(data);

            data.forEach(item => {
                termNames.push(item.term); 
            }); 
                
            var select = document.getElementById("term"); 
            select.innerHTML = '';

            termNames.forEach(function (term) {  
                var option = document.createElement("option");
                option.value = term;
                option.text = term;
                select.appendChild(option);
            });

            resolve(data); // Resolve with the fetched data
        }) 
        .catch(error => {
            reject(error); // Reject with the error
        });
    }); 
} 



function fetchCohortID(cohortName) { 
    return new Promise((resolve, reject) => {
        fetch('/getCohortID', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({ cohortName })  
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


function fetchDataAndPopulateSemester() { 
    return new Promise((resolve, reject) => {
        fetch('/getSemester', {  
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
            const semesterNames = []; 

            console.log(data);

            data.forEach(item => {
                semesterNames.push(item.semester); 
            }); 
                
            var select = document.getElementById("semester"); 
            select.innerHTML = ''; 
 
            semesterNames.forEach(function (semester) {  
                var option = document.createElement("option");
                option.value = semester;
                option.text = semester;
                select.appendChild(option);
            });

            resolve(data); // Resolve with the fetched data
        }) 
        .catch(error => {
            reject(error); // Reject with the error
        });
    }); 
} 



function fetchTermID(term , semester) { 
    return new Promise((resolve, reject) => {
        fetch('/getTermID', {  
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({ term , semester }),  

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




fetchDataAndPopulateTerm()
fetchDataAndPopulateSemester()