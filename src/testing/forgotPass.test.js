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
            //res.status(200).send({ message: 'Role ID obtained successfully' });
            res.status(200).send(result);
        }
    });
  };
 

describe('forgotPasswordEmailVerification function', () => {
  
  // Test cases for valid email
  describe('with valid email', () => {
    test('returns { affectedRows: 1 }', () => {
      const req = { body: { email: 'rs11g21@soton.ac.uk' } };  
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const expectedResponse = { affectedRows: 1 }; 

      db.query.mockImplementationOnce((sql, email, callback) => {
        callback(null, expectedResponse);
      });

      forgotPasswordEmailVerification(req, res); 
 
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expectedResponse);
    });
  }); 

  describe('with invalid or unregistered email', () => {
    test('returns an array of equal to 0', async () => {
      const req = { body: { email: 'sdjsndcs@soton.ac.uk' } }; 
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  
      // Mock the behavior of db.query to simulate the execution of the SQL query
      db.query.mockImplementationOnce((sql, email, callback) => {
        // Assuming an empty array as the data returned by the SQL query
        const data = []; // Empty array
        callback(null, data);
      });
  
      // Call the endpoint function
      await forgotPasswordEmailVerification(req, res);
  
      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.anything()); // Assert that res.send is called with some argument
      const responseArgument = res.send.mock.calls[0][0];
      console.log(responseArgument); // Log the response object
      
      // Assert that the response argument is an empty array
      expect(responseArgument).toEqual([]); // Check if the response argument is an empty array
    }); 
  });
  
  

});

