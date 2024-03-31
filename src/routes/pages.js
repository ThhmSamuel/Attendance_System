const express = require("express"); 
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");  
const uploadMC = require("../models/uploadMC");
const getMC = require("../models/getMC");

const router = express.Router();
  


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

module.exports = router;   