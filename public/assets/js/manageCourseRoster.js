
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
        console.log("fetching..")
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