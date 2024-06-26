const express = require("express");
const nodemailer = require("nodemailer");
const db = require("./src/routes/db-config") 
const app = express(); 
const cookie = require("cookie-parser"); 
const PORT = process.env.PORT || 5000;

const cors = require('cors');
const session = require('express-session');
const path = require('path');
const { log, Console } = require('console');

app.use(cors());  
app.use(express.json());

// Use express-session middleware
app.use(session({
    secret: 'your-secret-key', // Change this to a secure random string 
    resave: false,
    saveUninitialized: true, 
    cookie: { secure: false } // Set secure to true if using HTTPS 
  })); 

app.use("/js",express.static(__dirname + "/public/assets/js"));   // meaning , you can access "public/assets/js" with just  "js/" 
app.use("/css",express.static(__dirname + "/public/assets/css")); 
app.use("/scss",express.static(__dirname + "/public/assets/scss")); 
app.use("/img",express.static(__dirname + "/public/assets/img")); 
app.use("/student",express.static(__dirname + "/public/student")); 
app.use("/admin",express.static(__dirname + "/public/admin")); 
app.use("/lecturer",express.static(__dirname + "/public/lecturer"));   
app.use("/models",express.static(__dirname + "/public/models"));    
 
console.log(__dirname)  

app.set("view engine","ejs");      
app.set("views","./src/views");         
 
app.use(cookie());  
app.use(express.json()); 
 
db.connect((err)=>{
    if(err) throw err;
    console.log("Connected to database");  
});  

let activeSessionIDs = new Set(); // Set to store active session IDs

// STUDENT starts here --------------------------------------------------------

app.post('/studentModuleData', (req, res) => {
    // Assuming req.body contains the data sent from the client 
    const { email } = req.body;

    const sqlQuery1 = `SELECT moduleName , startMonth, endMonth FROM module_cohort JOIN cohort ON cohort.cohortID = module_cohort.cohortID JOIN module ON module_cohort.moduleID = module.moduleID JOIN student ON student.cohortID = module_cohort.cohortID JOIN cohort_term ON cohort_term.termID = student.termID WHERE studentEmail = '${email}';`;

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});


app.post('/studentAttendanceData', (req, res) => { 
    const { email , moduleName , attendanceStatus , monthYear } = req.body;  
      
    const [year, monthNumber] = monthYear.split("-");

    var sqlQuery1; 

    if (moduleName === "All" && attendanceStatus === "All" && monthYear === "All") { 

        console.log("All All All");
        sqlQuery1 = `SELECT * FROM class_session JOIN attendance ON class_session.classSessionID = attendance.classSessionID JOIN class_type ON class_type.class_typeID = class_session.class_typeID JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN attendance_status ON attendance.statusID = attendance_status.statusID JOIN attendance_threshold ON attendance_threshold.moduleID = module_lecturer.moduleID WHERE studentEmail = '${email}';`
        
    } else if (moduleName === "All" && attendanceStatus === "All") {

        console.log("All All");
        sqlQuery1 = `SELECT * FROM class_session JOIN attendance ON class_session.classSessionID = attendance.classSessionID JOIN class_type ON class_type.class_typeID = class_session.class_typeID JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN attendance_status ON attendance.statusID = attendance_status.statusID JOIN attendance_threshold ON attendance_threshold.moduleID = module_lecturer.moduleID WHERE studentEmail = '${email}' AND MONTH(startTime) = ${monthNumber} AND YEAR(startTime) = ${year};`
    
    } else if (moduleName === "All" && monthYear === "All") {

        console.log("All All");
        sqlQuery1 = `SELECT * FROM class_session JOIN attendance ON class_session.classSessionID = attendance.classSessionID JOIN class_type ON class_type.class_typeID = class_session.class_typeID JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN attendance_status ON attendance.statusID = attendance_status.statusID JOIN attendance_threshold ON attendance_threshold.moduleID = module_lecturer.moduleID WHERE studentEmail = '${email}' AND status = '${attendanceStatus}';`

    } else if (attendanceStatus === "All" && monthYear === "All") { 

        console.log("All All");
        sqlQuery1 = `SELECT * FROM class_session JOIN attendance ON class_session.classSessionID = attendance.classSessionID JOIN class_type ON class_type.class_typeID = class_session.class_typeID JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN attendance_status ON attendance.statusID = attendance_status.statusID JOIN attendance_threshold ON attendance_threshold.moduleID = module_lecturer.moduleID WHERE studentEmail = '${email}' AND moduleName = '${moduleName}';`
    
    } else if (moduleName === "All") {

        console.log("All");
        sqlQuery1 = `SELECT * FROM class_session JOIN attendance ON class_session.classSessionID = attendance.classSessionID JOIN class_type ON class_type.class_typeID = class_session.class_typeID JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN attendance_status ON attendance.statusID = attendance_status.statusID JOIN attendance_threshold ON attendance_threshold.moduleID = module_lecturer.moduleID WHERE studentEmail = '${email}' AND status = '${attendanceStatus}' AND MONTH(startTime) = ${monthNumber} AND YEAR(startTime) = ${year};`

    } else if (attendanceStatus === "All") {

        console.log("All");
        sqlQuery1 = `SELECT * FROM class_session JOIN attendance ON class_session.classSessionID = attendance.classSessionID JOIN class_type ON class_type.class_typeID = class_session.class_typeID JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN attendance_status ON attendance.statusID = attendance_status.statusID JOIN attendance_threshold ON attendance_threshold.moduleID = module_lecturer.moduleID WHERE studentEmail = '${email}' AND moduleName = '${moduleName}' AND MONTH(startTime) = ${monthNumber} AND YEAR(startTime) = ${year};`

    } else if (monthYear === "All") {
        
        console.log("All");
        sqlQuery1 = `SELECT * FROM class_session JOIN attendance ON class_session.classSessionID = attendance.classSessionID JOIN class_type ON class_type.class_typeID = class_session.class_typeID JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN attendance_status ON attendance.statusID = attendance_status.statusID JOIN attendance_threshold ON attendance_threshold.moduleID = module_lecturer.moduleID WHERE studentEmail = '${email}' AND moduleName = '${moduleName}' AND status = '${attendanceStatus}';` 

    } else {

        console.log("None All");
        sqlQuery1 = `SELECT * FROM class_session JOIN attendance ON class_session.classSessionID = attendance.classSessionID JOIN class_type ON class_type.class_typeID = class_session.class_typeID JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN attendance_status ON attendance.statusID = attendance_status.statusID JOIN attendance_threshold ON attendance_threshold.moduleID = module_lecturer.moduleID WHERE studentEmail = '${email}' AND moduleName = '${moduleName}' AND status = '${attendanceStatus}' AND MONTH(startTime) = ${monthNumber} AND YEAR(startTime) = ${year};`

    }

    // Wrapping the database query inside a promise  
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });

});


// STUDENT  ends here --------------------------------------------------------


// LECTURER starts here --------------------------------------------------------

app.get('/page', (req, res) => {    
    const sessionID = req.query.sessionID; 
    if (isValidSessionID(sessionID)) { 
        // Serve the webpage
        res.sendFile(path.join(__dirname, 'public/attendance-form.html'));   
    } else {   
        // Return an error response
        res.status(403).send('Invalid session ID'); 
    }
}); 

app.get('/formLogin', (req, res) => {
    const sessionID = req.query.sessionID;
  
    // Check if session ID is valid
    if (isValidSessionID(sessionID)) { 
        // Serve the webpage
        res.sendFile("loginPageAttendanceForm.html", {root:"./public/"});   
    } else {   
        // Return an error response
        res.status(403).send('Invalid session ID'); 
    } 
}); 



app.post('/insertClassSession', (req, res) => { 
    // Assuming req.body contains the data to be inserted
    const { startTime, endTime, moduleName, lecturerName, class_sessionID, classType } = req.body;

    console.log(lecturerName, moduleName, class_sessionID, classType, startTime, endTime);
    const sqlQuery1 = `SELECT lecturerID FROM lecturer WHERE name = "${lecturerName}"`;   
    const sqlQuery2 = `SELECT moduleID FROM module WHERE moduleName = '${moduleName}';`; 
    const sqlQuery3 = `SELECT statusID FROM session_status WHERE status = "Active"`
    const sqlQuery6 = `SELECT statusID FROM attendance_status where status='Absent';`;
    const sqlQuery9 = `SELECT class_typeID FROM class_type WHERE classType = '${classType}';`; 


    // Create a promise for each query
    const query1Promise = new Promise((resolve, reject) => {
        db.query(sqlQuery1, (error1, results1) => {
            if (error1) {
                reject('Error querying table1');
            } else {
                resolve(results1);
            }
        });
    });

    const query2Promise = new Promise((resolve, reject) => {
        db.query(sqlQuery2, (error2, results2) => {
            if (error2) {
                reject('Error querying table2');
            } else {
                resolve(results2);
            }
        });
    });
 
    const query3Promise = new Promise((resolve, reject) => {
        db.query(sqlQuery3, (error3, results3) => { 
            if (error3) {
                reject('Error querying table3');
            } else {
                resolve(results3);
            }
        });
    });

    const query6Promise = new Promise((resolve, reject) => {
        db.query(sqlQuery6, (error6, results6) => { 
            if (error6) {
                reject('Error querying table6');
            } else { 
                resolve(results6);
            }
        });
    });

    const query9Promise = new Promise((resolve, reject) => {
        db.query(sqlQuery9, (error9, results9) => { 
            if (error9) { 
                reject('Error querying table6');
            } else { 
                resolve(results9);
            }
        });
    });


    return Promise.all([query1Promise, query2Promise, query3Promise,query6Promise,query9Promise])
    .then(([results1, results2,results3,results6,results9]) => {  
        const rowDataPacket_lecturer = results1[0]; 
        const lecturerID = rowDataPacket_lecturer['lecturerID'];

        const rowDataPacket_module = results2[0];  
        const moduleID = rowDataPacket_module['moduleID']; 

        const rowDataPacket_status = results3[0];
        const statusID = rowDataPacket_status['statusID']; 

        const rowDataPacket_attendancestatus = results6[0]; 
        const attendance_statusID = rowDataPacket_attendancestatus['statusID']; 

        const rowDataPacket_classType = results9[0];
        const classTypeID = rowDataPacket_classType['class_typeID']; 

        const sqlQuery4 = `SELECT module_lecturer_ID FROM module_lecturer WHERE moduleID = "${moduleID}" AND lecturerID = "${lecturerID}";`;
        const query4Promise = new Promise((resolve, reject) => {
            db.query(sqlQuery4, (error3, results3) => {
                if (error3) {
                    reject('Error querying table4'); 
                } else { 
                    resolve(results3);
                }
            });
        });
        
        // Promise for query4 
        return query4Promise.then(results4 => {
            const moduleLecturerID = results4.map(rowDataPacket => rowDataPacket.module_lecturer_ID);

            const sqlQuery5 = `INSERT INTO class_session (startTime, endTime, classSessionID, module_lecturer_ID, statusID,class_typeID) VALUES ("${startTime}", "${endTime}", "${class_sessionID}", "${moduleLecturerID}", ${statusID}, ${classTypeID});`;
            db.query(sqlQuery5, (err, result) => {
                // if(err) return res.json(err);
                // return res.json({ message: "Class Session inserted successfully", result });
            });     


            const sqlQuery7 = `SELECT cohortID FROM module_lecturer WHERE module_lecturer_ID = "${moduleLecturerID}";`;

            // Promise for query 7 
            const query7Promise = new Promise((resolve, reject) => { 
                db.query(sqlQuery7, (error7, results7) => {
                    if (error7) {
                        reject('Error querying table7');
                    } else {
                        resolve(results7);  
                    } 
                });
            }); 


            return query7Promise.then(results7 => {

                const cohortID = results7.map(rowDataPacket => rowDataPacket.cohortID);
                const sqlQuery8 = `SELECT studentEmail FROM student WHERE cohortID = ${cohortID};`;


                // Promise for query 8 
                const query8Promise = new Promise((resolve, reject) => {
                    db.query(sqlQuery8, (error8, results8) => {
                        if (error8) {
                            reject('Error querying table8');
                        } else {
                            resolve(results8); 
                        }
                    });
                }); 

                return query8Promise.then(results8 => {
                    const studentEmails = results8.map(rowDataPacket => rowDataPacket.studentEmail);

                    const attendancePromises = studentEmails.map(student => {
                        const sql = `INSERT INTO attendance (studentEmail, classSessionID, statusID) VALUES ("${student}", "${class_sessionID}",${attendance_statusID})`;
                        return new Promise((resolve, reject) => {
                            db.query(sql, (err, result) => { 
                                if (err) { 
                                    console.error("Error inserting attendance:", err);  
                                    reject(err);
                                } else {
                                    resolve(result);
                                } 
                            });
                        });
                    }); 
            
                    // Execute all attendance insertion promises
                    return Promise.all(attendancePromises)
                        .then(() => {
                            return res.status(200).json({ message: "Attendance inserted successfully" });
                        })
                        .catch(error => {
                            console.error("Error inserting attendance:", error);
                            return res.status(500).json({ error: "Error inserting attendance" });
                        });
                });
            
            });

        });
        
    })
    .catch(error => {
        console.error('Error:', error);
        return false; // Return false in case of an error
    });

});


app.post('/expireClassSessionID' , (req,res) => {
    const { class_sessionID } = req.body;
    
    const sqlQuery1 = `SELECT statusID FROM session_status where status = "Expired"`;    
    const query1Promise = new Promise((resolve, reject) => {
        db.query(sqlQuery1, (error1, results1) => {
            if (error1) {
                reject('Error querying table1');
            } else {
                resolve(results1);
            }
        });
    });

    return query1Promise.then(results1 => {
        const rowDataPacket_status = results1[0];
        const statusID = rowDataPacket_status['statusID']; 

        const sqlQuery2 = `UPDATE class_session SET statusID = ${statusID} WHERE classSessionID = "${class_sessionID}";`;  
        db.query(sqlQuery2, (err, result) => {
            if(err) return res.json(err);
            return res.json({ message: "Class Session ID expired successfully", result });
        });
    }) 
})


function isStudentTakingSubject(studentEmail, moduleName) {
    
    const sqlQuery1 = `SELECT 
    CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS is_taking_subject
    FROM 
        student
        JOIN cohort ON student.cohortID = cohort.cohortID
        JOIN module_cohort ON module_cohort.cohortID = cohort.cohortID
        JOIN module ON module.moduleID = module_cohort.moduleID
    WHERE 
        studentEmail = '${studentEmail}' AND moduleName = '${moduleName}';`;

    // Wrapping the database query inside a promise
    return new Promise((resolve, reject) => {
        db.query(sqlQuery1, (error1, results1) => { 
            if (error1) {
                reject({ error: 'Error querying table2' });
            } else {
                resolve(results1);
            }
        });
    });
}




app.post('/submit-form', (req, res) => {
    const { lecturerName, moduleName, class_sessionID , studentEmail } = req.body; 
 
    isValidClassSessionID(lecturerName, moduleName, class_sessionID)  
    .then(isValid => {
        if (isValid) {

            isStudentTakingSubject(studentEmail, moduleName)
            .then((data) => {
                console.log(data); 

                const rowDataPacket_subjectStatus= data[0];
                const isTaking = rowDataPacket_subjectStatus['is_taking_subject'];  

                if(isTaking === 0) {

                    console.log('Student is not taking the subject');
                    res.status(403).send('Student is not taking the subject');
    
                } else {
    
                    const sqlQuery1 = `SELECT statusID FROM attendance_status where status='Present';`;
                    const query1Promise = new Promise((resolve, reject) => {
                        db.query(sqlQuery1, (error1, results1) => {
                            if (error1) {
                                reject('Error querying table1');
                            } else {
                                resolve(results1);
                            }
                        });     
                    });
    
                    return query1Promise.then(results1 => {
                        const rowDataPacket_status = results1[0];
                        const statusID = rowDataPacket_status['statusID']; 
    
                        const sqlQuery2 = `UPDATE attendance SET statusID = ${statusID} WHERE studentEmail = "${studentEmail}" AND classSessionID = "${class_sessionID}";`;  
                        db.query(sqlQuery2, (err, result) => {
                            if(err) return res.json(err);
                            return res.json({ message: "Attendance Updated Successfully", result });    
                        });
                    }) 
                }

            })
            .catch((error) => {
                console.error(error); 
            });

        } else { 
            console.log('Invalid class session ID'); 
            res.status(403).send('Invalid class session ID');  
        } 
    })
    .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response
    });

}); 


app.post('/getLatestTerm', (req, res) => {
    const sqlQuery = `SELECT MAX(term) AS latest_term FROM cohort_term`;

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery, (error, results) => {
                if (error) {
                    console.error('Error querying database:', error); // Log detailed error information
                    reject({ error: 'Error querying database' }); // Send a more descriptive error message
                } else {
                    resolve(results);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            console.error('Error processing request:', error); // Log detailed error information
            res.status(500).json(error); // Send the error back to the client
        });
});



app.get('/getSessionID', (req, res) => {
    // Create a new session
    req.session.regenerate((err) => {
      if (err) { 
        console.error('Error generating new session:', err);
        res.status(500).send('Error generating new session');
      } else {
        const sessionID = req.sessionID;   
        activeSessionIDs.add(sessionID); // Add the new session ID to the active set
  
        // Send the session ID to the client
        res.json({ sessionID });
  
        // Expire old session IDs
        expireOldSessionIDs(sessionID);  
      }
    });
}); 

app.post('/expireClassSessionID' , (req,res) => {
    const { class_sessionID } = req.body;
    
    const sqlQuery1 = `SELECT statusID FROM session_status where status = "Expired"`;    
    const query1Promise = new Promise((resolve, reject) => {
        db.query(sqlQuery1, (error1, results1) => {
            if (error1) {
                reject('Error querying table1');
            } else {
                resolve(results1);
            }
        });
    });

    return query1Promise.then(results1 => {
        const rowDataPacket_status = results1[0];
        const statusID = rowDataPacket_status['statusID']; 

        const sqlQuery2 = `UPDATE class_session SET statusID = ${statusID} WHERE classSessionID = "${class_sessionID}";`;  
        db.query(sqlQuery2, (err, result) => {
            if(err) return res.json(err);
            return res.json({ message: "Class Session ID expired successfully", result });
        });
    })
})

// Function to expire old session IDs
function expireOldSessionIDs(newSessionID) {
    activeSessionIDs.forEach((sessionID) => {
      if (sessionID !== newSessionID) {
        activeSessionIDs.delete(sessionID); // Remove expired session ID from the active set
      }
    });
}

// Check if the session ID is in the activeSessionIDs set  
function isValidSessionID(sessionID) {
    return activeSessionIDs.has(sessionID);
}
  
// Clear the active session IDs
app.post('/clearActiveSessionIDs', (req, res) => {
    activeSessionIDs.clear(); 
    res.sendStatus(200); 
});

// Function to check if the class session ID is valid 
function isValidClassSessionID(lecturerName, moduleName, class_sessionID) {  
    const sqlQuery1 = `SELECT lecturerID FROM lecturer WHERE name = "${lecturerName}"`;   
    const sqlQuery2 = `SELECT moduleID FROM module WHERE moduleName = '${moduleName}';`; 

    // Create a promise for each query
    const query1Promise = new Promise((resolve, reject) => {
        db.query(sqlQuery1, (error1, results1) => {
            if (error1) {
                reject('Error querying table1');
            } else {
                resolve(results1);
            }
        });
    });

    const query2Promise = new Promise((resolve, reject) => {
        db.query(sqlQuery2, (error2, results2) => {
            if (error2) {
                reject('Error querying table2');
            } else { 
                resolve(results2);
            }
        }); 
    });

    // Execute both queries and handle their results
    return Promise.all([query1Promise, query2Promise])
        .then(([results1, results2]) => {
            const rowDataPacket_lecturer = results1[0]; 
            const lecturerID = rowDataPacket_lecturer['lecturerID'];

            const rowDataPacket_module = results2[0];  
            const moduleID = rowDataPacket_module['moduleID'];

            const sqlQuery3 = `SELECT classSessionID FROM class_session JOIN session_status on class_session.statusID = session_status.statusID WHERE module_lecturer_ID = (SELECT module_lecturer_ID FROM module_lecturer WHERE moduleID = "${moduleID}" AND lecturerID = "${lecturerID}") AND status = 'Active';`;
            
            const query3Promise = new Promise((resolve, reject) => {
                db.query(sqlQuery3, (error3, results3) => {
                    if (error3) {
                        reject('Error querying table3');
                    } else {
                        resolve(results3);
                    }
                });
            });
            
            // Promise for query3
            return query3Promise.then(results3 => {
                const classSessionIDs = results3.map(rowDataPacket => rowDataPacket.classSessionID);
                return classSessionIDs.includes(class_sessionID);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            return false; // Return false in case of an error
        });
}

app.post('/lecturerModuleData', (req, res) => {
    // Assuming req.body contains the data sent from the client 
    const { email } = req.body;

    const sqlQuery1 = `SELECT moduleName FROM module_cohort JOIN module ON module.moduleID = module_cohort.moduleID JOIN module_lecturer ON module_lecturer.moduleID = module_cohort.moduleID JOIN lecturer ON lecturer.lecturerID = module_lecturer.lecturerID where email = '${email}';`;

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 

app.post('/getLecturerName', (req, res) => {
    // Assuming req.body contains the data sent from the client  
    const { email } = req.body;

    const sqlQuery1 = `SELECT name FROM lecturer WHERE email = '${email}';`;  

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});

app.post('/lecturerAttendanceData', (req, res) => { 
    const { email , moduleName , monthYear } = req.body;   

    console.log(email, moduleName, monthYear);
      
    const [year, monthNumber] = monthYear.split("-");

    var sqlQuery1;  

    if (email === 'None' && monthYear === "All"){
        sqlQuery1 = `SELECT * FROM class_session JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN lecturer ON lecturer.lecturerID = module_lecturer.lecturerID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN class_type ON class_type.class_typeID = class_session.class_typeID WHERE moduleName = '${moduleName}';`
    
    }else  if (email === 'None'){
        sqlQuery1 = `SELECT * FROM class_session JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN lecturer ON lecturer.lecturerID = module_lecturer.lecturerID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN class_type ON class_type.class_typeID = class_session.class_typeID WHERE moduleName = '${moduleName}' AND MONTH(startTime) = ${monthNumber} AND YEAR(startTime) = ${year};`

    } else if (moduleName === "All" && monthYear === "All") {
 
        console.log("All All");
        sqlQuery1 = `SELECT * FROM class_session JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN lecturer ON lecturer.lecturerID = module_lecturer.lecturerID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN class_type ON class_type.class_typeID = class_session.class_typeID WHERE email = '${email}';` 


    } else if (moduleName === "All") {

        console.log("All");
        sqlQuery1 = `SELECT * FROM class_session JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN lecturer ON lecturer.lecturerID = module_lecturer.lecturerID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN class_type ON class_type.class_typeID = class_session.class_typeID WHERE email = '${email}' AND MONTH(startTime) = ${monthNumber} AND YEAR(startTime) = ${year};`

    } else if (monthYear === "All") {
        
        console.log("All module"); 
        sqlQuery1 = `SELECT * FROM class_session JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN lecturer ON lecturer.lecturerID = module_lecturer.lecturerID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN class_type ON class_type.class_typeID = class_session.class_typeID WHERE email = '${email}' AND moduleName = '${moduleName}';`


    } else {  

        console.log("None All"); 
        sqlQuery1 = `SELECT * FROM class_session JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN lecturer ON lecturer.lecturerID = module_lecturer.lecturerID JOIN module ON module.moduleID = module_lecturer.moduleID JOIN class_type ON class_type.class_typeID = class_session.class_typeID WHERE email = '${email}' AND moduleName = '${moduleName}' AND MONTH(startTime) = ${monthNumber} AND YEAR(startTime) = ${year};`

    }

    // Wrapping the database query inside a promise  
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });

});



app.post('/classAttendanceData', (req, res) => {
    // Assuming req.body contains the data sent from the client 
    const { class_session_id } = req.body;

    const sqlQuery1 = `SELECT * FROM attendance JOIN class_session ON attendance.classSessionID = class_session.classSessionID JOIN student ON student.studentEmail = attendance.studentEmail JOIN attendance_status ON attendance.statusID = attendance_status.statusID JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID JOIN class_type ON class_type.class_typeID = class_session.class_typeID JOIN module ON module.moduleID = module_lecturer.moduleID WHERE class_session.classSessionID = '${class_session_id}';`;

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        }); 
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 



// LECTURER ends here ----------------------------------------------------------


// ADMIN starts here ----------------------------------------------------------- 

app.post('/getAllCohort', (req, res) => {
    // Assuming req.body contains the data sent from the client 

    const sqlQuery1 = `SELECT cohortName FROM cohort;`;  

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 


app.post('/getModuleByCohort', (req, res) => {
    // Assuming req.body contains the data sent from the client 

    const { cohortName } = req.body;

    const sqlQuery1 = `SELECT * FROM module_cohort JOIN module ON module.moduleID = module_cohort.moduleID JOIN cohort ON cohort.cohortID = module_cohort.cohortID WHERE cohortName = '${cohortName}';`;  

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else { 
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 


app.post('/getAllTerm', (req, res) => {  

    const sqlQuery1 = `SELECT DISTINCT(term) FROM cohort_term`;  

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
}); 


app.post('/getStudentAttendanceRateByModule', (req, res) => {   

    const { moduleName , term } = req.body;

    const sqlQuery1 =  
    `SELECT 
    student.studentEmail,
    name,
    ROUND(((totalSessions - COALESCE(COUNT(attendance_status.status), 0)) / totalSessions) * 100, 1) AS 'attendance_rate',
    attendance_threshold.percentage,
    COALESCE(COUNT(attendance_status.status), 0) AS absence,
    totalSessions
    FROM
        student
    LEFT JOIN
        attendance ON student.studentEmail = attendance.studentEmail
    LEFT JOIN
        class_session ON attendance.classSessionID = class_session.classSessionID
    LEFT JOIN
        module_lecturer ON class_session.module_lecturer_ID = module_lecturer.module_lecturer_ID
    LEFT JOIN
        attendance_status ON attendance.statusID = attendance_status.statusID AND attendance_status.status = 'Absent'
    LEFT JOIN
        attendance_threshold ON module_lecturer.moduleID = attendance_threshold.moduleID
    LEFT JOIN
        module ON module_lecturer.moduleID = module.moduleID
    LEFT JOIN
        cohort_term ON student.termID = cohort_term.termID
    WHERE
        moduleName = '${moduleName}' 
        AND term = '${term}'
    GROUP BY student.studentEmail;`;   


    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});



app.post('/getStudentPrevRate', (req, res) => {   

    const { moduleName , studentEmail } = req.body;

    const sqlQuery1 =  
    `SELECT * FROM studentnotification
    JOIN emailbatch ON emailbatch.emailBatchID = studentnotification.emailBatchID
    JOIN module ON module.moduleID = emailbatch.moduleID
    WHERE moduleName = "${moduleName}" AND studentEmail = "${studentEmail}";`;   

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});



app.post('/getTerm', (req, res) => {   

    const sqlQuery1 =  `SELECT DISTINCT(term) FROM cohort_term;`;   

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        }); 
});

app.post('/getSemester', (req, res) => {    

    const sqlQuery1 =  `SELECT DISTINCT(semester) FROM cohort_term;`;   

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});


app.post('/getTermID', (req, res) => {   
 
    const { term , semester } = req.body 

    const sqlQuery1 =  `SELECT termID FROM cohort_term WHERE term = "${term}" AND semester = ${semester};`;    

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});


app.post('/getCohortID', (req, res) => {   
 
    const { cohortName } = req.body 

    const sqlQuery1 =  `SELECT cohortID FROM cohort WHERE LOWER(cohortName) = "${cohortName}";`;          

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});



app.post('/insertStudentData', (req, res) => {   
 
    const { name, studentID, studentEmail, cohortID, termID } = req.body 

    const sqlQuery1 =  `INSERT INTO student(name, studentID, studentEmail, cohortID, termID) VALUES ("${name}","${studentID}","${studentEmail}",${cohortID},${termID});`;          

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});



app.post('/insertLoginCredential', (req, res) => {   
 
    const {email, password, roleID } = req.body 

    const sqlQuery1 =  `INSERT INTO logincredential (email, password, roleID) VALUES ("${email}", MD5("${password}"), ${roleID});`;          

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});



// ADMIN end here --------------------------------------------------------------



// Sending email --------------------------
app.post('/sendEmail', async (req, res) => {
    const { attendanceRate, threshold, email, moduleName } = req.body;
    console.log("Email in server : ",email)  
    // Create transporter for Gmail
    let gmailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: 'rollsroyceisdabest@gmail.com', 
            pass: 'fuxx vksp npfw llmw',
        },
    });

    // Define email content
    let emailContent = {
        from: '"UoSM Admin" uosm_admin@gmail.com>',
        to: email,
        subject: 'Attendance Alert',
        html: `
            <h1>Attendance Alert</h1>
            <p>Your attendance rate (${attendanceRate}%) is below the threshold (${threshold}%) for the module ${moduleName}.</p>
            <p>Please take necessary actions to improve your attendance.</p>
        `,
    };

    try {
        // Send email
        let info = await gmailTransporter.sendMail(emailContent);
        console.log('Email sent:', info.messageId);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});




app.post('/insertEmailBatch', (req, res) => {   
 
    const {emailBatchID, moduleID, dateTaken} = req.body  

    console.log(emailBatchID) 

    const sqlQuery1 =  `INSERT INTO emailbatch (emailBatchID , moduleID, dateTaken) VALUES ("${emailBatchID}", "${moduleID}", "${dateTaken}");`;          

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});



app.post('/insertStudentNotification', (req, res) => {   
 
    const {studentEmail, emailBatchID, prevAttendanceRate, threshold} = req.body   


    const sqlQuery1 =  `INSERT INTO studentnotification (studentEmail, emailBatchID, prevAttendanceRate, threshold) VALUES ("${studentEmail}","${emailBatchID}",${prevAttendanceRate},${threshold});`;          

    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});




app.post('/getModuleID', (req, res) => {    
 
    const {moduleName} = req.body   
 
    console.log("Server: ",moduleName); 

    const sqlQuery1 =  `SELECT * FROM module WHERE moduleName = "${moduleName}";`;          
 
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log(data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});


app.post('/getEmailBatch', (req, res) => {    
 
    const sqlQuery1 =  `SELECT * FROM emailbatch 
    JOIN module ON module.moduleID = emailbatch.moduleID;`;           
 
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            }); 
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log(data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});




app.post('/getEmailDetailsByBatchID', (req, res) => {    
    
    const {emailBatchID} = req.body;

    console.log("Server: ",emailBatchID);

    const sqlQuery1 =  `SELECT * FROM emailbatch 
    JOIN studentnotification ON emailbatch.emailBatchID = studentnotification.emailBatchID
    JOIN student ON student.studentEmail = studentnotification.studentEmail
    JOIN module ON module.moduleID = emailbatch.moduleID 
    WHERE emailbatch.emailBatchID = "${emailBatchID}";`;
 
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log(data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});





app.post('/getRoleID', (req, res) => {    
    
    const {email} = req.body;  

    const sqlQuery1 =  `SELECT roleID FROM logincredential
    WHERE email = "${email}";`; 
 
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            }); 
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log(data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});



app.post('/sendEmailForgotPassword', async (req, res) => {
    const { email , otp } = req.body;

    // Create transporter for Gmail
    let gmailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: 'rollsroyceisdabest@gmail.com', 
            pass: 'fuxx vksp npfw llmw',
        },
    });
 
    // Define email content
    let emailContent = {
        from: '"UoSM Admin" uosm_admin@gmail.com>',
        to: email,
        subject: 'Reset Password',
        html: `
            <h1>OTP number</h1> 
            <p>Your OTP is ${otp}.</p> 
            <p>The OTP is only valid for 40 seconds.</p>
        `,
    };

    try {
        // Send email
        let info = await gmailTransporter.sendMail(emailContent);
        console.log('Email sent:', info.messageId);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});



app.post('/updatePassword', (req, res) => {    
    
    const {email , password} = req.body;   


    const sqlQuery1 =  `UPDATE logincredential SET password = MD5("${password}") WHERE email = "${email}";`; 
 
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log(data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});



app.post('/getFullStudentData', (req, res) => {    
    
    const {userEmail} = req.body;     


    const sqlQuery1 =  `SELECT * FROM student
    JOIN cohort_term ON cohort_term.termID = student.termID
    JOIN cohort ON cohort.cohortID = student.cohortID
    JOIN programme ON programme.programmeID = cohort.programmeID
    WHERE studentEmail = "${userEmail}";`; 
  
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log(data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});


app.post('/removeClassSessionID', (req, res) => {    
    
    const {classSessionID} = req.body;     


    const sqlQuery1 =  `DELETE FROM class_session 
    WHERE classSessionID = "${classSessionID}";`; 
  
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log(data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => { 
            res.status(500).json(error); // Send the error back to the client
        });
});



app.post('/removeAttendanceData', (req, res) => {    
    
    const {classSessionID} = req.body;     

    const sqlQuery1 =  `DELETE FROM attendance 
    WHERE classSessionID = "${classSessionID}";`; 
  
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log(data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});


app.post('/updateStudentAttendance', (req, res) => {

    const {currSessionID, studentEmail, status} = req.body;     


    const sqlQuery1 =  `UPDATE attendance SET statusID = ${status}
    WHERE studentEmail = "${studentEmail}" AND classSessionID = "${currSessionID}"`;  
   
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => { 
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            }); 
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log("From server : ",data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
})





app.post('/getFullLecturerData', (req, res) => {    
    
    const {userEmail} = req.body;     


    const sqlQuery1 =  `SELECT * FROM lecturer
    JOIN programme ON programme.programmeID = lecturer.programmeID
    JOIN module_lecturer ON module_lecturer.lecturerID = lecturer.lecturerID
    JOIN module ON module.moduleID = module_lecturer.moduleID
    WHERE email = "${userEmail}";`;  
  
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log(data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});




app.post('/getFullAdminData', (req, res) => {    
    
    const {userEmail} = req.body;     


    const sqlQuery1 =  `SELECT * FROM admin
    WHERE email = "${userEmail}";`;  
  
    // Wrapping the database query inside a promise
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            db.query(sqlQuery1, (error1, results1) => {
                if (error1) {
                    reject({ error: 'Error querying table2' });
                } else {
                    resolve(results1);
                }
            });
        });
    };

    // Call the function that returns the promise 
    executeQuery()
        .then((data) => {
            console.log(data);
            res.status(200).json(data); // Send the result back to the client
        })
        .catch((error) => {
            res.status(500).json(error); // Send the error back to the client
        });
});

 
app.use("/",require("./src/routes/pages"));    // bring anything that starts with "/" to  "./src/routes/pages"
app.use("/api", require("./src/controllers/auth"));  // bring anything that starts with "/api" to "./src/controllers/auth"  
app.listen(PORT);   


