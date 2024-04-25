const db = require("../routes/db-config");

// Fetch data from database
function getMC(req, res) {
    db.query('SELECT mc_file.*, student.name AS studentName FROM mc_file JOIN student ON mc_file.studentEmail = student.studentEmail', (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  }
  
  // Update status column to 'Approved'
  function approveFile(req, res) {
    const fileId = req.params.id;
    db.query('UPDATE mc_file SET status = "Approved" WHERE id = ?', fileId, (err, result) => {
      if (err) throw err;
      res.send('Status updated to Approved');
    });
  }
  
  // Update status column to 'Rejected'
  function rejectFile(req, res) {
    const fileId = req.params.id;
    db.query('UPDATE mc_file SET status = "Rejected" WHERE id = ?', fileId, (err, result) => {
      if (err) throw err;
      res.send('Status updated to Rejected');
    });
  }

  function getFileHandler(req, res) {
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
    getMC,
    approveFile,
    rejectFile,
    getFileHandler
  };