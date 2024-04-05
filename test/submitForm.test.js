const request = require('supertest');
const app = require('../server.js'); 


// Test case for the '/submit-form' endpoint
describe('POST /submit-form', () => { 
    it('should return status 200 and success message if attendance is updated successfully', async () => {

        const requestBody = {
            lecturerName: 'Dr. David Johnson',
            moduleName: 'Networks',
            class_sessionID: 'xgU7_',
            studentEmail: 'rs11g21@soton.ac.uk' 
        };

        const response = await request(app)
            .post('/submit-form')
            .send(requestBody);

        expect(response.status).toBe(200); 

    });


    it('should return status 403 if student is not taking the subject', async () => {

        const requestBody = {
            lecturerName: 'Dr. David Johnson',
            moduleName: 'Networks',
            class_sessionID: 'xgU7_',
            studentEmail: 'student1@soton.ac.uk'  
        };

        const response = await request(app)
            .post('/submit-form')
            .send(requestBody);

        expect(response.status).toBe(403); 
        expect(response.text).toBe('Student is not taking the subject');

    }); 

    it('should return status 403 if class session ID is invalid', async () => {

        const requestBody = {
            lecturerName: 'Dr. David Johnson',
            moduleName: 'Networks',
            class_sessionID: 'xgU7_12',
            studentEmail: 'rs11g21@soton.ac.uk'    
        };

        // Send a POST request to the '/submit-form' endpoint
        const response = await request(app)
            .post('/submit-form')
            .send(requestBody);

        // Check if the response status is 403
        expect(response.status).toBe(403);

        // Check if the response body contains the error message
        expect(response.text).toBe('Invalid class session ID');
    }); 


    it('should return status 403 if class session ID is a valid session ID but it has expired', async () => {

        const requestBody = {
            lecturerName: 'Dr. David Johnson', 
            moduleName: 'Networks',
            class_sessionID: 'Dmj_n',
            studentEmail: 'rs11g21@soton.ac.uk'    
        };

        // Send a POST request to the '/submit-form' endpoint
        const response = await request(app)
            .post('/submit-form')
            .send(requestBody);

        // Check if the response status is 403
        expect(response.status).toBe(403);

        // Check if the response body contains the error message
        expect(response.text).toBe('Invalid class session ID'); 
    }); 

});
