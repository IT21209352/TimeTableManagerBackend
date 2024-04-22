const ClassSession = require('../models/ClassSession');
const NodeCache = require("node-cache");
const Notification = require('../models/Notification')
const classSessionCache = new NodeCache({ stdTTL: 10 }); // Set TTL for cache to 10 seconds
const { io } = require("../index");

// Function to add a class session
const addSession = async (req, res) => {
    const { Course, Date, StartTime, EndTime, Faculty, Location } = req.body;
    let existingSession;
    try {
        existingSession = await ClassSession.findOne({ Course: Course });
    } catch (err) {
        console.log(err.message);
    }
    if (existingSession) {
        return res.status(400).json({ message: "ClassSession Already Exists" });
    } else {
        const classSession = new ClassSession({
            Course: Course,
            Date: Date,
            StartTime: StartTime,
            EndTime: EndTime,
            Faculty: Faculty,
            Location: Location
        });
        const message = `New ${Course} Session at ${Date} from ${StartTime} to ${EndTime}`
        const notification = new Notification({Course:Course , Message:message})
        try {
            await classSession.save();
            await notification.save();
            io.emit("session_added", { message: "A new session has been added!" })
            console.log("ClassSession Registered to the DB");
        } catch (err) {
            console.log(err.message);
        }

        // Fetch all class sessions from the database and store them in cache
        ClassSession.find()
            .then((items) => {
                classSessionCache.set("classSessions", items); // Store fetched data in cache
            });

        return res.status(201).json({ message: "ClassSession Registered to the DB" });
    }
};

// Function to get all class sessions
const getSessions = async (req, res) => {
    // Check if data exists in cache
    const cachedSessions = classSessionCache.get("classSessions");
    if (cachedSessions) {
        console.log("Retrieving sessions from cache");
        return res.json(cachedSessions);
    }

    // If data is not in cache, fetch it from the database
    ClassSession.find()
        .then((items) => {
            // Store fetched data in cache
            classSessionCache.set("classSessions", items);
            res.status(200).json(items);
        })
        .catch((err) => {
            console.error("Error fetching class sessions:", err);
            res.status(500).json({ error: "Internal server error" });
        });
};


// Function to get class sessions for requested courses
const getMySessions = async (req, res) => {
    try {
        const requestedCourses = req.query.courses; // Array of requested course objects { Code, Name }

        // Check if data exists in cache
        const cachedSessions = classSessionCache.get("classSessions");
        if (!cachedSessions) {
            // If data is not in cache, fetch it from the database
            const classSessions = await ClassSession.find();
            // Store fetched data in cache
            classSessionCache.set("classSessions", classSessions);
        } else {
            console.log("Retrieving sessions from cache");
        }

        // Filter class sessions based on requested course names
        const matchedSessions = cachedSessions.filter(session => {
            // Check if any requested course Code+Name combination matches the class session Course
            return requestedCourses.some(course => `${course.Code} ${course.Name}` === session.Course);
        });
        res.json(matchedSessions);
    } catch (error) {
        console.error("Error fetching class sessions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Function to update a class session
const updateSessions = async (req, res) => {
    const { Course, Date, StartTime, EndTime, Faculty, Location } = req.body;
    const message = `Updated ${Course} Session at ${Date} from ${StartTime} to ${EndTime}`
    const notification = new Notification({Course:Course , Message:message})
    await notification.save();
    ClassSession.findByIdAndUpdate(
        { _id: req.params.id },
        {
            Course: Course,
            Date: Date,
            StartTime: StartTime,
            EndTime: EndTime,
            Faculty: Faculty,
            Location: Location
        }
    ).then(
        io.emit("session_added", { message: "A new session has been changed!" }),
        res.status(200).send({ Status: "Session Updated" })
    ).catch((err) => console.log(err));
};

// Function to delete a class session
const deleteSessions = async (req, res) => {
    const message = "A class session has been deleted. Check your time table"
    const notification = new Notification({Course:"AllImp" , Message:message})
    await notification.save();
    ClassSession.findByIdAndDelete({ _id: req.params.id })
        .then(res.status(200).send({ Status: "Session Deleted" }))
        .catch((err) => console.log(err));
};


// Function to get all notification
const getNotification = async (req, res) => {
    // If data is not in cache, fetch it from the database
    Notification.find()
        .then((items) => {
            res.status(200).json(items);
        })
        .catch((err) => {
            console.error("Error fetching notifications", err);
            res.status(500).json({ error: "Internal server error" });
        });
};

// Function to delete a notification
const deleteNotification= async (req, res) => {
    Notification.findByIdAndDelete({ _id: req.params.id })
        .then(res.status(200).send({ Status: "Notification Deleted" }))
        .catch((err) => console.log(err));
};

// Exporting the functions
module.exports = {
    getNotification,
    deleteNotification,
    getMySessions,
    deleteSessions,
    updateSessions ,
    addSession ,
    getSessions
}