const express = require("express");
const db = require("./src/routes/db-config") 
const app = express(); 
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 5000;

// app.use("/js",express.static(__dirname + "/public/assets/js")); 
// app.use("/css",express.static(__dirname + "/public/assets/css")); 
// app.use("/scss",express.static(__dirname + "/public/assets/scss")); 
// app.use("/img",express.static(__dirname + "/public/assets/img")); 

app.use("/js",express.static(__dirname + "/public copy/js"));  
app.use("/css",express.static(__dirname + "/public copy/css"));  

console.log(__dirname)

app.set("view engine","ejs");   
app.set("views","./src/views");     
app.use(cookie());  
app.use(express.json());
 
db.connect((err)=>{
    if(err) throw err;
    console.log("Connected to database");  
}); 

 
app.use("/",require("./src/routes/pages"));   
app.use("/api", require("./src/controllers/auth")); 
app.listen(PORT);   