const express = require('express');
const { addCourse, getCourseData, removeCourse, updateCourse } = require("../controllers/course_controller");
const router = express.Router();

const { verifyTokenStaffnAdminRoutes,verifyTokenSep } = require("../controllers/token_controller"); // Import the verifyToken middleware

// Route to add a new course (accessible only to admins  admins n staff  )
router.post("/addcourse", verifyTokenStaffnAdminRoutes, addCourse);

// Route to get course data (accessible to all authenticated users)
router.get("/getcoursedata", verifyTokenSep, getCourseData);

// Route to remove a course by ID (accessible only to admins n staff)
router.delete("/removecourse/:id", verifyTokenStaffnAdminRoutes, removeCourse );

// Route to update a course by ID (accessible only to admins n staff )
router.put("/updatecourse/:id", verifyTokenStaffnAdminRoutes, updateCourse);

module.exports = router;