const mongoose = require('mongoose');
const {
    addSession,
    getSessions,
    getMySessions,
    updateSessions,
    deleteSessions
} = require('../controllers/class_session_controller');
const ClassSession = require('../models/ClassSession');
const NodeCache = require('node-cache');
const dotenv = require("dotenv");

dotenv.config();
// Mocking the console.error function
console.error = jest.fn();

// Mocking NodeCache
jest.mock('node-cache');
const mockCache = new NodeCache();

describe('Session Controller', () => {

// Connecting to the test database
beforeAll(async () => {
// Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
});

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('addSession', () => {
        it('should add a new session', async () => {
            const req = {
                body: {
                    Course: 'Test Course',
                    Date: '2024-04-01',
                    StartTime: '09:00 AM',
                    EndTime: '11:00 AM',
                    Faculty: 'Test Faculty',
                    Location: 'Test Location'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await addSession(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();
        });

       
    });
    //to run  the test file
    //npx jest tests/session_controller.test.js

});