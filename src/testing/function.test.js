const db = require("../routes/db-config");


jest.mock('../routes/db-config', () => ({
    query: jest.fn()
  }));

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
 

describe('removeUsers function', () => {
  // Test cases for valid email
  describe('with valid email', () => {
    test('should return success message if user is found and removed', () => {
      const req = { body: { email: 'thhm@soton.ac.uk' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      db.query.mockImplementationOnce((sql, email, callback) => {
        callback(null, { affectedRows: 1 });
      });

      removeUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'User removed successfully' });
    });

    test('should return "User not found" if no user with given email is found', () => {
      const req = { body: { email: 'nonexistent@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      db.query.mockImplementationOnce((sql, email, callback) => {
        callback(null, { affectedRows: 0 });
      });

      removeUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  // Test cases for invalid email
  describe('with invalid email', () => {
    test('should return status 400 and "Invalid email" message', () => {
      const req = { body: { email: null } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      removeUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Invalid email' });
    });
  });

  // Test cases for database errors
  describe('when encountering a database error', () => {
    test('should return status 500 and "Error removing user" message', () => {
      const req = { body: { email: 'thhm@soton.ac.uk' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      db.query.mockImplementationOnce((sql, email, callback) => {
        callback(new Error('Database error'));
      });

      removeUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Error removing user' });
    });
  });
});


