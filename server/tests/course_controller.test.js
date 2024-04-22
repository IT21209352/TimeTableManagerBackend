// Importing necessary modules and the Course model
const mongoose = require('mongoose');
const Course = require('../models/Course');
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Connecting to the test database
beforeAll(async () => {

// Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
});

// Disconnecting from the test database after all tests are done
afterAll(async () => {
    await mongoose.connection.close();
});

// Test suite for the Course model
describe('Course Model', () => {
    // Test case for adding a new course
    it('should add a new course', async () => {
        const courseData = {
            Name: 'Test Course',
            Code: 'TEST101',
            Credits: '3',
            Description: 'This is a test course',
            Duration: 30,
            Faculty: 'Test Faculty'
        };

        const newCourse = new Course(courseData);
        const savedCourse = await newCourse.save();

        expect(savedCourse._id).toBeDefined();
        expect(savedCourse.Name).toBe(courseData.Name);
        expect(savedCourse.Code).toBe(courseData.Code);
        expect(savedCourse.Credits).toBe(courseData.Credits);
        expect(savedCourse.Description).toBe(courseData.Description);
        expect(savedCourse.Duration).toBe(courseData.Duration);
        expect(savedCourse.Faculty).toBe(courseData.Faculty);
    });

    // Test case for adding a duplicate course code
    it('should not add a course with duplicate code', async () => {
        const courseData = {
            Name: 'Test Course',
            Code: 'TEST101',
            Credits: '3',
            Description: 'This is a test course',
            Duration: 30,
            Faculty: 'Test Faculty'
        };

        const courseWithDuplicateCode = new Course(courseData);
        await courseWithDuplicateCode.save();

        // Attempt to save another course with the same code
        const duplicateCourse = new Course(courseData);

        // Expect an error to be thrown
        await expect(duplicateCourse.save()).rejects.toThrow();
    });


    //to run  the test files 
    //npx jest tests/course_controller.test.js

});