const jwt = require('jsonwebtoken');

// const getUserInfo = (req, next) => {
    
//     if (!req.cookies.userRegistered) {
//         req.userEmail = null; // If the cookie doesn't exist, set userEmail to null
//         return next; // Call next to pass control to the next middleware or route handler
//     }
    
//     try {
//         console.log("check info")
//         const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_secret);
//         req.userEmail = decoded.email; // Attach userEmail to the request object
//         next; // Call next to pass control to the next middleware or route handler
//     } catch (err) {
//         console.error('Error decoding JWT token:', err);
//         req.userEmail = null; // If there's an error, set userEmail to null
//         next; // Call next to pass control to the next middleware or route handler
//     }
// }

const getUserInfo = async (req) => {
    try {
        if (!req.cookies.userRegistered) {
            return null; // If the cookie doesn't exist, return null
        } else {
            const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_secret);
            req.userEmail = decoded.email; // Attach userEmail to the request object
            console.log(req.userEmail);
            return decoded.email; // Return the user's email
        }
    } catch (err) {
        console.error('Error decoding JWT token:', err);
        return null; // If there's an error, return null
    }
};

module.exports = getUserInfo;