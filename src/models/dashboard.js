const db = require("../routes/db-config");

function getLecturerName(studentEmail, callback) {
    db.query('SELECT lecturer.name AS lecturer_name FROM lecturer JOIN student ON student.PAT_ID = lecturer.lecturerID WHERE student.studentEmail = ?', studentEmail, (err, result) => {
        if (err) {
            callback(err, null); // Pass error to the callback
            return;
        }
        
        if (result.length > 0) {
            const lecturerName = result[0].lecturer_name;
            callback(null, lecturerName); // Pass lecturer name to the callback
        } else {
            callback(null, "No lecturer found"); // If no result found
        }
    });
}

function getCohortName(req, res) {
    const studentEmail = req.params.email; // Assuming email is passed in req.params
  
    db.query('SELECT cohort.cohortName FROM cohort JOIN student ON student.cohortID = cohort.cohortID WHERE student.studentEmail = ?', studentEmail, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        if (result.length > 0) {
            const cohortName = result[0].cohortName;

            // Call getLecturerName function and send both cohort name and lecturer name in the response
            getLecturerName(studentEmail, (err, lecturerName) => {
                if (err) {
                    res.status(500).send(err.message);
                    return;
                }

                res.send(`Cohort Name for ${studentEmail}: ${cohortName}, Lecturer Name: ${lecturerName}`);
            });
        } else {
            res.send(`No cohort found for ${studentEmail}`);
        }
    });
}
function getLecturerProgramme(studentEmail, callback) {
    db.query('SELECT programme.programme AS programme_name FROM programme JOIN lecturer ON lecturer.programmeID = programme.programmeID JOIN student ON student.PAT_ID = lecturer.lecturerID WHERE student.studentEmail = ?', studentEmail, (err, result) => {
        if (err) {
            callback(err, null); // Pass error to the callback
            return;
        }
        
        if (result.length > 0) {
            const programmeName = result[0].programme_name;
            callback(null, programmeName); // Pass programme name to the callback
        } else {
            callback(null, "No programme found"); // If no result found
        }
    });
}


  

module.exports = {
    getCohortName,
    getLecturerName,
    getLecturerProgramme
  };