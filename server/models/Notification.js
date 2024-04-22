const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the user model
const notificationSchema = new Schema({
    Course: {
        type: String,  //name of the user
        required: false
    },
    Message: {
        type: String, // type of the User admin/student/staff
        required: false
    },
});

// Create the user model using the schema
const notificationModal = mongoose.model("Notification", notificationSchema);

module.exports = notificationModal;