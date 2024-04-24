const express = require("express"); 
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");  

const getMC = require("../models/getMC");
const emailVerification = require("../controllers/emailVerification"); 

const getUserInfo = require("../controllers/getUserInfo");

const { uploadMC, getFileById, getFileNames } = require("../models/uploadMC");

const { addUsers, removeUsers, userList } = require("../models/manage-user"); // Destructure functions

//manage course roster
const { addStudent, updateStudent, populateOption, populateTerm } = require("../models/manage-course-roster");


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




router.get("/forgetPassword",emailVerification) 
 
router.get("/logout",logout)     
 
//Route to upload MC
router.post("/uploadMC",uploadMC,getUserInfo)
router.get("/getFileNames", getFileNames,getUserInfo)
router.get("/file/:id",getFileById)


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
router.get("/populateOption",populateOption)
router.get("/populateTerm",populateTerm)



module.exports = router;   