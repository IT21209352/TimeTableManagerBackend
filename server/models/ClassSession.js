const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the session model
const sessionSchema = new Schema({
    Course: {
        type: String,
        required: false // Course for the session (optional)
    },
    Date: {
        type: String,
        required: false // Date of the session (optional)
    },
    StartTime: {
        type: String,
        required: false // Start time of the session (optional)
    },
    EndTime: {
        type: String,
        required: false // End time of the session (optional)
    },
    Faculty: {
        type: String,
        required: false // Faculty conducting the session (optional)
    },
    Location: {
        type: String,
        required: true // Location of the session is required
    }
});

// Create the mongoose model using the schema
const ClassSession = mongoose.model("ClassSession", sessionSchema);

module.exports = ClassSession;