// const jwt = require('jsonwebtoken'); //to create cookie
// const db  = require("../routes/db-config");
// const bcrypt = require("bcryptjs"); // for encrypting passwords

// const login = async (req,res)=>{
//     const {email,password} = req.body;
//     if(!email || !password) return res.json({status: "error", error: "Please enter your email and password"}); 
//     else { 
//         db.query("SELECT * FROM user WHERE email = ?",[email], async (Err, result) => {
//             if (Err) throw Err;
//             if (!result.length || !await bcrypt.compare(password,result[0].password)) return res.json({status: "error", error: "Invalid email or password"});
//             else {
//                 const token = jwt.sign({id : result[0].id}, process.env.JWT_secret, {
//                     expiresIn: process.env.JWT_EXPIRES,
//                 }); 
//                 const cookieOptions = {
//                     expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),    
//                     httpOnly: true
//                 }
//                 res.cookie("userRegistered", token, cookieOptions);
//                 return res.json({status: "success", success: "You have been logged in successfully"});  
//             }     
//         })
//     }
// }     

// module.exports = login;  

// Attendance managment system -----------------------------------------
const jwt = require('jsonwebtoken'); //to create cookie
const db  = require("../routes/db-config");
const md5 = require("md5"); // for encrypting passwords 

const login = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.json({status: "error", error: "Please enter your email and password"}); 
    else { 
        db.query("SELECT * FROM logincredential WHERE email = ?",[email], async (Err, result) => { 
            const hashedPassword = md5(password);

            if (Err) throw Err;
            if (!result.length || hashedPassword !== result[0].password) return res.json({status: "error", error: "Invalid email or password"});  
            else {
                const token = jwt.sign({email : result[0].email}, `${process.env.JWT_secret}`, {
                    expiresIn: process.env.JWT_EXPIRES,
                }); 
                
                const cookieOptions = { 
                    expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),    
                    httpOnly: true 
                }
                res.cookie("userRegistered", token, cookieOptions);
                return res.json({status: "success", success: "You have been logged in successfully"});  
            }     
        })
    }
}     

module.exports = login;  