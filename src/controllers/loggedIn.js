const db = require("../routes/db-config");
const jwt = require("jsonwebtoken");
const loggedIn = (req,res,next) => {
    if (!req.cookies.userRegistered) return next(); //we check if the cookie exist
    try { 
        const decoded = jwt.verify(req.cookies.userRegistered, `${process.env.JWT_secret}`); //we verify the cookie
        db.query("SELECT * FROM `logincredential` JOIN role ON role.roleID = logincredential.roleID WHERE email = ?",[decoded.email], (err,result)=>{
            if(err) return next();
            req.user = result[0];  
            return next();

        }); //we check if the user exist
    } catch (err) {
        if(err) return next()
    } 
}

module.exports = loggedIn;   