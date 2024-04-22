const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the resource model
const resourceSchema = new Schema({
    Code: {
        type: String,
        required: false // Indicating that this field is not mandatory
    },
    Name: {
        type: String,
        required: false // Indicating that this field is not mandatory
    },
    Availability: {
        type: String,
        required: false // Indicating that this field is not mandatory
    },
    Date: {
        type: String,
        required: false // Indicating that this field is not mandatory
    },
    StartTime: {
        type: String,
        required: false // Indicating that this field is not mandatory
    },
    EndTime: {
        type: String,
        required: false // Indicating that this field is not mandatory
    },
    Location: {
        type: String,
        required: false // Indicating that this field is not mandatory
    },
    Faculty: {
        type: String,
        required: false // Indicating that this field is not mandatory
    }
});

// Create the mongoose model using the schema
const ResourceSchema = mongoose.model("Resources", resourceSchema);

module.exports = ResourceSchema;