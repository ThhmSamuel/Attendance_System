// const express = require("express");
// const db = require("./src/routes/db-config") 
// const app = express(); 
// const cookie = require("cookie-parser");
// const PORT = process.env.PORT || 5000;

// // app.use("/js",express.static(__dirname + "/public/assets/js")); 
// // app.use("/css",express.static(__dirname + "/public/assets/css")); 
// // app.use("/scss",express.static(__dirname + "/public/assets/scss")); 
// // app.use("/img",express.static(__dirname + "/public/assets/img")); 

// app.use("/js",express.static(__dirname + "/public copy/js"));  
// app.use("/css",express.static(__dirname + "/public copy/css"));  
 
// console.log(__dirname)

// app.set("view engine","ejs");   
// app.set("views","./src/views");     
// app.use(cookie());  
// app.use(express.json());
 
// db.connect((err)=>{
//     if(err) throw err;
//     console.log("Connected to database");  
// });  

 
// app.use("/",require("./src/routes/pages"));   
// app.use("/api", require("./src/controllers/auth")); 
// app.listen(PORT);   


// Attendance management system --------------------------------------------- 
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
 
console.log(__dirname)  

app.set("view engine","ejs");      
app.set("views","./src/views");         
 
app.use(cookie());  
app.use(express.json()); 
 
db.connect((err)=>{
    if(err) throw err;
    console.log("Connected to database");  
});  

 
app.use("/",require("./src/routes/pages"));    // bring anything that starts with "/" to  "./src/routes/pages"
app.use("/api", require("./src/controllers/auth"));  // bring anything that starts with "/api" to "./src/controllers/auth"  
app.listen(PORT);   