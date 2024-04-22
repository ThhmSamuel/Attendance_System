const express = require("express"); 
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");  
const uploadMC = require("../models/uploadMC");
const getMC = require("../models/getMC");


// const addUsers = require("../models/manageUser");
// const removeUsers = require("../models/manageUser");
// const userList = require("../models/manageUser");
const { addUsers, removeUsers, userList } = require("../models/manage-user"); // Destructure functions

//manage course roster
const { addStudent, updateStudent } = require("../models/manage-course-roster");


const router = express.Router();
  
// Middleware to parse JSON data
router.use(express.json());

router.get("/",loggedIn,(req,res)=>{   
 
    if (req.user){

        const roleType = req.user.roleType;

        if(roleType === "Admin"){ 
            res.render("admin",{user:req.user});     

        }else if(roleType === "Lecturer"){ 
            res.render("lecturer",{user:req.user});    
 
        }else if(roleType === "Student"){  
            res.render("student",{user:req.user});    
        } 
        
    }else{
        res.sendFile("loginPage.html", {root:"./public/"})   
    }
         
}); 
 



router.get("/logout",logout)     
 
//Route to upload MC
router.post("/uploadMC",uploadMC)

//Route to get MC file
router.get("/getMC",getMC)

//Route to add user
router.post("/addUsers",addUsers)
//Route to remove user
router.post("/removeUsers",removeUsers)
//Route to get userList
router.get("/userList",userList) 


//Route to add student
router.post("/addStudent",addStudent)
//Route to update student
router.post("/updateStudent",updateStudent)


module.exports = router;   