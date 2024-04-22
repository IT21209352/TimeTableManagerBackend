const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');


const { createServer } = require("http");
const { Server } = require("socket.io");


// Load environment variables from .env file which contains secrets
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Define PORT

// Enable parsing of cookies
app.use(cookieParser());

// Enable CORS with credentials and allowed origin
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// Parse JSON bodies
app.use(bodyParser.json());

// Retrieve MongoDB URL from environment variables
const URL = process.env.MONGODB_URL;

// Connect to MongoDB
mongoose.connect(URL);

// Get the default connection
const connection = mongoose.connection;

let io;

// Once MongoDB connection is open, start the Express server
connection.once("open", () => {

    const httpServer = createServer(app);
    io = new Server(httpServer); // Create Socket.IO server

    // Socket.IO server logic
    io.on('connection', (socket) => {

        console.log('Socket.IO server is running');

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

    });

    httpServer.listen(PORT, () => {
        console.log(`Express server is running on port ${PORT}`);
    });

    console.log("MongoDB Connection Established");
    // Set up routes after the Socket.IO connection is established
    setUpRoutes();
});

// Use routes

function setUpRoutes() {
  
    // Import and use routes
    const userRouter = require("./routes/user_routes");
    const courseRouter = require("./routes/course_routes");
    const sessionRouter = require("./routes/sessionRoutes");
    const resourceRouter = require("./routes/resource_routes");

    // Set up routes
    app.use("/user", userRouter); // User routes
    app.use("/course", courseRouter); // Course routes
    app.use("/session", sessionRouter); // Session routes
    app.use("/resource", resourceRouter); // Resource routes

}

module.exports = { app, io }; 
