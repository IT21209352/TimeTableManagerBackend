const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the course model
const courseSchema = new Schema({
    Name: {
        type: String,
        required: true // Name of the course is required
    },
    Code: {
        type: String,
        required: true,
        unique: true // Course code must be unique
    },
    Credits: {
        type: String,
        required: true // Credits of the course are required
    },
    Description: {
        type: String,
        required: true // Description of the course is required
    },
    Duration: {
        type: Number,
        required: true // Duration of the course in number of days
    },
    Faculty: {
        type: String,
        required: true // Faculty offering the course is required
    }
});

// Create the mongoose model using the schema
const courseModel = mongoose.model("Course", courseSchema);

module.exports = courseModel;