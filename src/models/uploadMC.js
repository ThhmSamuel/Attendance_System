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


async function getFileNames(req, res) {
    try {
        // Retrieve user email asynchronously
        const userEmail = await getUserInfo(req);

        // Fetch file names from the database
        db.query('SELECT id, file_name, status, startDate, endDate FROM mc_file WHERE studentEmail = ?', [userEmail], (error, results) => {
            if (error) {
                console.error("Error fetching file names:", error);
                res.status(500).send("Error fetching file names");
                return;
            }
            console.log("File names:", results);
            // Send the fetched data as JSON response
            res.json(results);
        });
    } catch (error) {
        console.error("Error fetching user email:", error);
        res.status(500).send("Error fetching user email");
    }
}

  


function getFileById(req, res) {
    const fileId = req.params.id;
    // Fetch file data from the database
    db.query('SELECT file_data, file_name, status, startDate, endDate FROM mc_file WHERE id = ?', [fileId], (error, results) => {
      if (error) {
        console.error("Error fetching file data:", error);
        res.status(500).send("Error fetching file data");
        return;
      }
      if (results.length > 0) {
        const fileData = results[0].file_data;
        const fileName = results[0].file_name;
        const status = results[0].status;
        const startDate = results[0].startDate;
        const endDate = results[0].endDate;
  
        // Set content type based on file extension
        const contentType = getContentType(fileName);
  
        // Send the appropriate content type
        res.contentType(contentType);
  
        // Send the file data as response
        res.send(fileData);
      } else {
        res.status(404).send('File not found');
      }
    });
  }
  
  function getContentType(fileName) {
    // Get file extension
    const fileExtension = fileName.split('.').pop().toLowerCase();
  
    // Map file extensions to content types
    switch (fileExtension) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      // Add more cases for other file types if needed
      default:
        return 'application/octet-stream'; // Default to binary data
    }
  }
  


module.exports = {
    uploadMC,
    getFileById,
    getFileNames
};