// const express = require("express");
// const loggedIn = require("../controllers/loggedIn");
// const logout = require("../controllers/logout");  
// const router = express.Router();

// router.get("/",loggedIn,(req,res)=>{

//     if (req.user){
//         res.render("index",{status:"loggedIn", user:req.user}); 
//     }else{  
//         res.render("index",{status:"no", user:"nothing"});
//     }
      
// }); 

// router.get("/register",(req,res)=>{
//     // res.sendFile("register.html", {root:"./public copy"})
//     res.sendFile("register.html", {root:"./public copy/"})
// }); 


// router.get("/login",(req,res)=>{ 
//     res.sendFile("login.html", {root:"./public copy/"}) 
// }); 

// router.get("/logout",logout)  


// module.exports = router; 
 


// Attendance management system ------------------------------
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