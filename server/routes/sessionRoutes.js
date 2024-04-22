const express = require('express');
const { addSession, getSessions, updateSessions, deleteSessions, getMySessions , getNotification, deleteNotification,} = require("../controllers/class_session_controller");
const router = express.Router();

const { verifyTokenSep, verifyTokenAdminRoutes } = require("../controllers/token_controller");

// Route to add a new session (accessible only to admins)
router.post("/addsession", verifyTokenAdminRoutes, addSession);

// Route to get all sessions (accessible to all authenticated users)
router.get("/getsessions", verifyTokenSep, getSessions);

// Route to update a session by ID (accessible only to admins)
router.put("/updatesessions/:id", verifyTokenAdminRoutes, updateSessions);

// Route to get sessions for the logged-in user (accessible to all authenticated users)
router.get("/getmysessions", verifyTokenSep, getMySessions);

// Route to delete a session by ID (accessible only to admins)
router.delete("/deletesessions/:id", verifyTokenAdminRoutes, deleteSessions);

// Route to get all notifications
router.get("/notifications", verifyTokenSep, getNotification);

// Route to delete a notification by id
router.delete("/notifications/:id", verifyTokenSep, deleteNotification);

module.exports = router;