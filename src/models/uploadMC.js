const db = require("../routes/db-config");
const multer = require("multer");
const path = require('path');


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
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }
        if (!req.file) {
            console.log("No file uploaded");
            return res.status(400).send("No file uploaded");
        }

        console.log(req.file.filename);

        // Insert the file data into the database directly 
        var insertData = "INSERT INTO mc_file (file_name, file_data) VALUES(?, ?)";
        db.query(insertData, [req.file.originalname, req.file.buffer], (err, result) => {
            if (err) {
                console.log("Error uploading file:", err);
                return res.status(500).send("Error uploading file");
            }
            console.log("File uploaded successfully");
            return res.status(200).send('File uploaded successfully');  
        });
    });
};

module.exports = uploadMC;
