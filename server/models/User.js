const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the user model
const userSchema = new Schema({
    Name: {
        type: String,  //name of the user
        required: false
    },
    Type: {
        type: String, // type of the User admin/student/staff
        required: false
    },
    ID: {
        type: String, // ID of the user
        required: false
    },
    Courses: [], // Array to store user's courses
    Faculty: {
        type: String,
        required: false
    },
    Email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    Password: {
        type: String,
        required: true,
        minlength: 6 // Minimum password length
    }
});

// Create the user model using the schema
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;