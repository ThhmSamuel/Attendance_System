const db = require("../routes/db-config");

// const addUsers = (req, res) => {
//     const { name, email, password, role } = req.body;
//     const sql = 'INSERT INTO logincredential (email, password, roleID) VALUES (?, ?, ?)';
//     db.query(sql, [email, password, role], (err, result) => {
//       if (err) {
//         res.status(500).send('Error adding user');
//       } else {
//         res.status(201).send('User added successfully');
//       }
//     });
//   };

// const removeUsers = (req, res) => {
//     const userId = req.params.id;
//     const sql = 'DELETE FROM logincredential WHERE id = ?';
//     db.query(sql, [userId], (err, result) => {
//         if (err) {
//         res.status(500).send('Error removing user');
//         } else {
//         res.status(200).send('User removed successfully');
//         }
//     });
// };

// const userList = (req, res) => {
//     const sql = 'SELECT * FROM logincredential';
//     db.query(sql, (err, results) => {
//       if (err) {
//         res.status(500).send('Error retrieving users');
//       } else {
//         const users = results.map(user => ({
//           id: user.id,
//           email: user.email,
//           roleID: user.roleID
//         }));
  
//         // Render the users in a table format
//         const tableRows = users.map(user => `<tr><td>${user.id}</td><td>${user.email}</td><td>${user.roleID}</td></tr>`);
//         const table = `
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Email</th>
//                 <th>Role ID</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${tableRows.join('')}
//             </tbody>
//           </table>
//         `;
  
//         res.send(table);
//       }
//     });
//   };


const addUsers = (req, res) => {
    const { email, password, role } = req.body;
    const sql = 'INSERT INTO logincredential (email, password, roleID) VALUES (?, ?, ?)';
    db.query(sql, [email, password, role], (err, result) => {
      if (err) {
        res.status(500).send('Error adding user');
      } else {
        res.status(201).send('User added successfully');
      }
    });
};

const removeUsers = (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM logincredential WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
        res.status(500).send('Error removing user');
        } else {
        res.status(200).send('User removed successfully');
        }
    });
};

const userList = (req, res) => {
    const sql = 'SELECT * FROM logincredential';
    db.query(sql, (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving users');
      } else {
        const users = results.map(user => ({
          id: user.id,
          email: user.email,
          roleID: user.roleID
        }));
  
        res.json(users);
      }
    });
};
  

// module.exports = addUsers;
// module.exports = removeUsers;
// module.exports = userList;
module.exports = {
    addUsers,
    removeUsers,
    userList
  };
  