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
  
  module.exports = {
    getMC,
    approveFile,
    rejectFile
  };