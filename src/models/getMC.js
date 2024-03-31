const db = require("../routes/db-config");

// Route for retrieving uploaded files from the database
const getMC = (req, res) => {
    // Query to retrieve all data from the mc_file table
    var retrieveData = "SELECT file_name, file_data FROM mc_file";

    db.query(retrieveData, (err, results) => {
        if (err) {
            console.log("Error retrieving files:", err);
            return res.status(500).send("Error retrieving files");
        }

        if (results.length === 0) {
            console.log("No files found in the database");
            return res.status(404).send("No files found in the database");
        }

        // Iterate through the results and send them as response
        results.forEach((row) => {
            // Send file data along with file name
            res.write(`<h2>${row.file_name}</h2>`);
            res.write(`<img src="data:image/jpeg;base64,${row.file_data.toString('base64')}"/>`);
        });

        // End response
        res.end();
    });
};

module.exports = getMC;
