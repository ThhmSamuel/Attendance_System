const db = require("../routes/db-config");

const addStudent = (req, res) => {
    const { name, studentID, PAT_ID, studentEmail, cohortID, termID } = req.body;
    const sql = 'INSERT INTO student (name, studentID, PAT_ID, studentEmail, cohortID, termID) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, studentID, PAT_ID, studentEmail, cohortID, termID], (err, result) => {
      if (err) {
        res.status(500).send({message: 'Error adding student'});
      } else {
        res.status(201).send({message: 'Student added successfully'});
      }
    });
};

const updateStudent = (req, res) => {
    const { studentID, cohortID, termID } = req.body;
    const sql = 'UPDATE student SET cohortID = ?, termID = ? WHERE studentID = ?';
    db.query(sql, [cohortID, termID, studentID], (err, result) => {
      if (err) {
        res.status(500).send({message: 'Error updating student'});
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send({message: 'Student not found'});
        } else {
          res.status(200).send({message: 'Student updated successfully'});
        }
      }
    });
};

module.exports = {
    addStudent,
    updateStudent
  };