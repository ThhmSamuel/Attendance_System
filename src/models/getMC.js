const db = require("../routes/db-config");
const cron = require('node-cron');


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
      // Update attendance status to "Approved Absent"
      updateAttendanceStatus(fileId);
      res.send('Status updated to Approved');
    });
  }

  function updateAttendanceStatus(fileId) {
    // Fetch the start date and end date from mc_file table
    db.query('SELECT startDate, endDate, studentEmail FROM mc_file WHERE id = ?', fileId, (err, result) => {
        if (err) {
            console.error('Error fetching start and end dates from mc_file:', err);
            return;
        }

        const startDate = result[0].startDate;
        const endDate = result[0].endDate;
        const userEmail = result[0].studentEmail;

        console.log("student email: ", userEmail);

        // Update attendance status for the range of dates between startDate and endDate for the specific user
        db.query('UPDATE attendance SET statusID = ? WHERE classSessionID IN (SELECT classSessionID FROM class_session WHERE DATE(startTime) BETWEEN ? AND ?) AND studentEmail = ?', [3, startDate, endDate, userEmail], (err, result) => {
            if (err) {
                console.error('Error updating attendance status:', err);
                return;
            }
            console.log('Attendance status updated to "Approved Absent" for dates between:', startDate, 'and', endDate, 'for user:', userEmail);
        });
    });
}



// Define the schedule for the task (runs every day at midnight)
cron.schedule('0 0 * * *', () => {
    // Query for leave records with end dates in the future
    db.query('SELECT id FROM mc_file WHERE endDate > CURDATE()', (err, results) => {
        if (err) {
            console.error('Error fetching future leave records:', err);
            return;
        }
        
        // Iterate over each leave record
        results.forEach(row => {
            const fileId = row.id;
            updateAttendanceStatus(fileId);
        });
    });
}, {
    timezone: 'Asia/Kuala_Lumpur' // Replace 'Your_Timezone' with your timezone (e.g., 'America/New_York')
});

  
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