const emailVerification = (req,res) => {
    res.sendFile("emailVerification.html", {root:"./public/"})     
}
  
module.exports = emailVerification;    