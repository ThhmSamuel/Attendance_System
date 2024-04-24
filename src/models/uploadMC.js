const db = require("../routes/db-config");
const multer = require("multer");
const path = require('path');

const getUserInfo = require("../controllers/getUserInfo");

// Upload File / MC Functions
var storage = multer.memoryStorage(); // Store files in memory instead of disk

// Define the maximum size for uploading picture i.e. 5 MB. It is optional.
const maxSize = 5 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png|pdf/;
        var mimetype = filetypes.test(file.mimetype);
 
        var extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
 
        if (mimetype && extname) {
            return cb(null, true);
        }
 
        cb(
            new Error("Error: File upload only supports the following filetypes - " + filetypes)
        );
    }
}).single("mypic");


const uploadMC = async (req, res, next) => {
    try {
        // Get the current user's email
        const userEmail = await getUserInfo(req);
        console.log("waiting")
        
        if (!userEmail) {
            console.error("User email not found");
            return res.status(401).send("User email not found");
        }
        
        // Log the user's email
        console.log("User email:", userEmail);
        
        upload(req, res, function (err) {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).send(err.message);
            }

            // Extract additional form data
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const notes = req.body.notes;

            if (!req.file) {
                console.error("No file uploaded");
                return res.status(400).send("No file uploaded");
            }

            // Insert the file data into the database directly
            var insertData = "INSERT INTO mc_file (studentEmail, startDate, endDate, notes, file_name, file_data) VALUES(?, ?, ?, ?, ?, ?)";
            db.query(insertData, [userEmail, startDate, endDate, notes, req.file.originalname, req.file.buffer], (err, result) => {
                if (err) {
                    console.error("Error inserting file into database:", err);
                    return res.status(500).send("Error uploading file");
                }
                console.log("File uploaded successfully");
                // Send success message to the client
                res.send('File uploaded successfully!');
            });
        });
    } catch (error) {
        console.error("Error in uploadMC middleware:", error);
        return res.status(500).send("Internal Server Error");
    }
};

const applicationTable = async (req, res) => {
    try {
        // Get the user's email from the request (assuming it's stored in req.userEmail)
        const userEmail = getUserInfo(req);
        if (!userEmail) {
            return res.status(401).send("User email not found");
        }

        // Fetch files from the database based on the user's email
        const files = await db.query("SELECT * FROM mc_file WHERE studentEmail = ?", [userEmail]);

        res.json(files);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getFileById = async (req, res) => {
    try {
        // Fetch the file data from the database based on the file ID
        const fileId = req.params.id;
        const file = await db.query("SELECT file_data FROM mc_file WHERE id = ?", [fileId]);

        // Check if file exists
        if (file.length === 0 || !file[0].file_data) {
            return res.status(404).send('File not found');
        }

        // Set the appropriate content type
        res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type based on your file type
        
        // Send the file data as the response
        res.send(file[0].file_data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    uploadMC,
    applicationTable,
    getFileById
};