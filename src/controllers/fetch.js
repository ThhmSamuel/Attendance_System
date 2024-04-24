const jwt = require('jsonwebtoken');
const db = require("../routes/db-config");
const md5 = require("md5");

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ status: "error", error: "Please enter your email and password" });
    else {
        db.query("SELECT email, name, password FROM logincredential WHERE email = ?", [email], async (err, result) => {
            if (err) {
                console.error("Error fetching user:", err);
                return res.status(500).json({ status: "error", error: "Internal Server Error" });
            }
            if (!result.length || md5(password) !== result[0].password) {
                return res.json({ status: "error", error: "Invalid email or password" });
            } else {
                const { email, name } = result[0];
                const token = jwt.sign({ email }, `${process.env.JWT_secret}`, {
                    expiresIn: process.env.JWT_EXPIRES,
                });
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                };
                res.cookie("userRegistered", token, cookieOptions);
                return res.json({ status: "success", success: "You have been logged in successfully", name });
            }
        });
    }
}

module.exports = fetch;
