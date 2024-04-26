const db = require("../routes/db-config");


jest.mock('../routes/db-config', () => ({
    query: jest.fn()
}));


const forgotPasswordEmailVerification = (req, res) => {
    const email = req.body.email;
    console.log("Email received from client:", email);
    if (!email) {
        return res.status(400).send({ message: 'Invalid email' });
    }
    const sql = 'SELECT roleID FROM logincredential WHERE email = ?;'
    db.query(sql, email, (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Error accessing roleID' }); 
        } else { 
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'RoleID not found' });
            }
            res.status(200).send({ message: 'Role ID obtained successfully' });
        }
    });
  };
 

describe('forgotPasswordEmailVerification function', () => {
  // Test cases for valid email
  describe('with valid email', () => {
    test('returns an array of size not equal to 0', () => {
      const req = { body: { email: 'rs11g21@soton.ac.uk' } }; 
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      db.query.mockImplementationOnce((sql, email, callback) => {
        callback(null, { affectedRows: 1 });
      });

      forgotPasswordEmailVerification(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Role ID obtained successfully' });

    });
  });

  
  describe('with invalid or unregistered email', () => {
    test('returns an array of equal to 0', () => {
      const req = { body: { email: 'sdjsndcs@soton.ac.uk' } }; 
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      db.query.mockImplementationOnce((sql, email, callback) => {
        callback(null, { affectedRows: 1 });
      });

      forgotPasswordEmailVerification(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Role ID obtained successfully' });
      const responseArgument = res.send.mock.calls[0][0];
      console.log(responseArgument); // Log the response object
      
      const dataObject = res.send.mock.calls[0][0].data;
      console.log(dataObject); 
      
    }); 
  });

});

