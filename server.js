const express = require("express");
const db = require("./src/routes/db-config") 
const app = express(); 
const cookie = require("cookie-parser"); 
const PORT = process.env.PORT || 5000;

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
    `SELECT name, ROUND(((totalSessions - COUNT(status)) / totalSessions) * 100 ,1) as 'attendance_rate' , attendance_threshold.percentage ,  COUNT(status) as absence , totalSessions 
    FROM class_session
    JOIN attendance ON class_session.classSessionID = attendance.classSessionID
    JOIN module_lecturer ON module_lecturer.module_lecturer_ID = class_session.module_lecturer_ID
    JOIN attendance_status ON attendance.statusID = attendance_status.statusID
    JOIN attendance_threshold ON attendance_threshold.moduleID = module_lecturer.moduleID
    JOIN module ON module.moduleID = module_lecturer.moduleID
    JOIN student ON student.studentEmail = attendance.studentEmail
    JOIN cohort_term ON cohort_term.termID = student.termID
    WHERE status = 'Absent' AND moduleName = '${moduleName}' AND term = '${term}'
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
// ADMIN end here --------------------------------------------------------------




 
app.use("/",require("./src/routes/pages"));    // bring anything that starts with "/" to  "./src/routes/pages"
app.use("/api", require("./src/controllers/auth"));  // bring anything that starts with "/api" to "./src/controllers/auth"  
app.listen(PORT);   


