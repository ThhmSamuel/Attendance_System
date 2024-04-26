// rs11g21@soton.ac.uk All All All

const request = require('supertest');
const app = require('../server.js'); 


// Test case for the '/submit-form' endpoint
describe('POST /studentAttendanceData', () => { 
    it('should return status 200 when the option is set to "All" for moduleName, attendanceStatus, monthYear', async () => {


        const requestBody = {
            email: 'rs11g21@soton.ac.uk',
            moduleName: 'All', 
            attendanceStatus: 'All',
            monthYear: 'All' 
        };

        const response = await request(app)
            .post('/studentAttendanceData')
            .send(requestBody);

        expect(response.status).toBe(200); 

    });


    it('should return status 200 and set to "All" for moduleName, attendanceStatus', async () => {


        const requestBody = {
            email: 'rs11g21@soton.ac.uk',
            moduleName: 'All', 
            attendanceStatus: 'All',
            monthYear: '2024-4' 
        };

        const response = await request(app)
            .post('/studentAttendanceData')
            .send(requestBody);

        expect(response.status).toBe(200); 

    });

    it('should return status 200 and "All" for moduleName and monthYear', async () => {


        const requestBody = {
            email: 'rs11g21@soton.ac.uk', 
            moduleName: 'All', 
            attendanceStatus: 'Present', 
            monthYear: 'All' 
        };

        const response = await request(app)
            .post('/studentAttendanceData')
            .send(requestBody);

        expect(response.status).toBe(200); 

    });

    it('should return status 200 and "All" for attendanceStatus and monthYear', async () => {


        const requestBody = {
            email: 'rs11g21@soton.ac.uk', 
            moduleName: 'Networks', 
            attendanceStatus: 'All', 
            monthYear: 'All' 
        };

        const response = await request(app)
            .post('/studentAttendanceData')
            .send(requestBody);

        expect(response.status).toBe(200); 

    });

    it('should return status 200 and set to "All" for moduleName', async () => {


        const requestBody = {
            email: 'rs11g21@soton.ac.uk',
            moduleName: 'All', 
            attendanceStatus: 'Present',
            monthYear: '2024-4' 
        };

        const response = await request(app)
            .post('/studentAttendanceData')
            .send(requestBody);

        expect(response.status).toBe(200); 

    });

    it('should return status 200 and set to "All" for attendanceStatus', async () => {


        const requestBody = {
            email: 'rs11g21@soton.ac.uk',
            moduleName: 'Networks', 
            attendanceStatus: 'All',
            monthYear: '2024-4' 
        };

        const response = await request(app)
            .post('/studentAttendanceData')
            .send(requestBody);

        expect(response.status).toBe(200); 

    });

    it('should return status 200 and set to "All" for monthYear', async () => {


        const requestBody = {
            email: 'rs11g21@soton.ac.uk',
            moduleName: 'Networks', 
            attendanceStatus: 'Present',
            monthYear: 'All' 
        };

        const response = await request(app)
            .post('/studentAttendanceData')
            .send(requestBody);

        expect(response.status).toBe(200); 

    });


    it('should return status 200 and none is set to all', async () => {


        const requestBody = {
            email: 'rs11g21@soton.ac.uk', 
            moduleName: 'Networks', 
            attendanceStatus: 'Present', 
            monthYear: '2024-4' 
        };

        const response = await request(app)
            .post('/studentAttendanceData')
            .send(requestBody);

        expect(response.status).toBe(200); 

    });

    
});
