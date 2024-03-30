// no need register 
// const db = require("../routes/db-config");
// const bcrypt = require("bcrypt"); // for encrypting passwords

// const register = async (req,res)=>{
//     const { email , password:Npassword } = req.body; //Npassword mean normal password
//     if(!email || !Npassword){ 
//         return res.json({status: "error", error: "Please enter your email and password"});
//     } else {
//          console.log(email)
//         db.query("SELECT email FROM user WHERE email = ?",[email],async (err,result)=> { 
//             if(err) throw err;
//             if(result[0]) return res.json({status: "error", error: "Email already exists"});  
//             else{
//                 const password = await bcrypt.hash(Npassword,8); //encrypting password  , without await , we will get [object promise] in database 
//                 console.log(password)
//                 db.query("INSERT INTO user SET ?",{email:email,password:password},(error,result)=>{
//                     if(error) throw error;
//                     return res.json({status: "success", success: "You have been registered successfully"});  
//                 })
//             }
//         })  
//     }
   
// }

// module.exports = register;     