const db = require("../routes/db-config");

const addStudent = (req, res) => {
    console.log("Adding...");
    const { name, studentId, PAT_ID, studentEmail, cohortId, termId } = req.body;
    console.log(req.body);
    const sql = 'INSERT INTO student (name, studentId, PAT_ID, studentEmail, cohortId, termId) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, studentId, PAT_ID, studentEmail, cohortId, termId], (err, result) => {
      if (err) {
        console.error("Error adding student:", err);
        res.status(500).send({message: 'Error adding student'});
      } else {
        res.status(201).send({message: 'Student added successfully'});
      }
    });
};

const updateStudent = (req, res) => {
    const { studentId, cohortId, termId } = req.body;
    console.log(req.body);
    const sql = 'UPDATE student SET cohortId = ?, termId = ? WHERE studentId = ?';
    db.query(sql, [studentId, cohortId, termId ], (err, result) => {
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