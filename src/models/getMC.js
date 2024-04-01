// getMC.js
const db = require("../routes/db-config");

// Route for retrieving uploaded files from the database
const getMC = (req, res) => {
    // Query to retrieve all data from the mc_file table
    var retrieveData = "SELECT file_name, file_data FROM mc_file";

    db.query(retrieveData, (err, results) => {
        if (err) {
            console.log("Error retrieving files:", err);
            return res.status(500).json({ error: "Error retrieving files" });
        }

        if (results.length === 0) {
            console.log("No files found in the database");
            return res.status(404).json({ error: "No files found in the database" });
        }

        // Map results to objects containing file name and base64-encoded data
        const files = results.map(row => {
            return {
                file_name: row.file_name,
                file_data: row.file_data.toString('base64')
            };
        });

        // Send JSON response containing array of file objects
        res.json(files);
    });
};

module.exports = getMC;
