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

// Mocking req and res objects
const req = { 
    body: {
        email: 'test@example.com',
        password: 'password',
        role: 'user'
    }
};

const res = {
    status: jest.fn(() => res),
    send: jest.fn()
};

// Mocking the db.query method
jest.mock('../routes/db-config', () => ({
    query: jest.fn()
}));

// Test cases
describe('addUsers function', () => {
    beforeEach(() => {
        // Clear mock function calls before each test
        jest.clearAllMocks();
    });

    it('should add a user successfully', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            // Simulate successful insertion
            callback(null, { insertId: 1 });
        });

        await addUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ message: 'User added successfully' });
    });

    it('should handle database error', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            // Simulate database error
            callback(new Error('Database error'));
        });

        await addUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ message: 'Error adding user' });
    });
});
