const db = require("../routes/db-config");




const addUsers = (req, res) => {
    const { email, password, role } = req.body;
    const sql = 'INSERT INTO logincredential (email, password, roleID) VALUES (?, ?, ?)';
    db.query(sql, [email, password, role], (err, result) => {
      if (err) {
        res.status(500).send({message: 'Error adding user'});
      } else {
        res.status(201).send({message: 'User added successfully'});
      }
    });
};

const removeUsers = (req, res) => {
  const email = req.body.email;
  console.log("Email received from client:", email);
  if (!email) {
      return res.status(400).send({ message: 'Invalid email' });
  }
  const sql = 'DELETE FROM logincredential WHERE email = ?';
  db.query(sql, email, (err, result) => {
      if (err) {
          res.status(500).send({ message: 'Error removing user' });
      } else {
          if (result.affectedRows === 0) {
              return res.status(404).send({ message: 'User not found' });
          }
          res.status(200).send({ message: 'User removed successfully' });
      }
  });
};


// const userList = (req, res) => {
//     const sql = 'SELECT * FROM logincredential';
//     db.query(sql, (err, results) => {
//       if (err) {
//         res.status(500).send('Error retrieving users');
//       } else {
//         const users = results.map(user => ({
//           //id: user.id,
//           email: user.email,
//           roleID: user.roleID
//         }));
  
//         res.json(users);
//       }
//     });
// };
  
const userList = (req, res) => {
  const sql = `SELECT logincredential.*, role.roleType AS roleName FROM logincredential INNER JOIN role ON logincredential.roleID = role.roleID;`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving users');
    } else {
      const users = results.map(user => ({
        id: user.id,
        email: user.email,
        roleName: user.roleName
      }));

      res.json(users);
    }
  });
};



module.exports = {
    addUsers,
    removeUsers,
    userList
  };
  