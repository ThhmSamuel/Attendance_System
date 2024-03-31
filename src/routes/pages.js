const express = require("express"); 
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");  
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
 

module.exports = router;   