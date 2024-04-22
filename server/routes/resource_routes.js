const express = require('express');
const { addResource, getResource, deleteResource, updateResource, bookResource } = require("../controllers/resources_controller");
const router = express.Router();
const { verifyTokenStaffnAdminRoutes } = require("../controllers/token_controller"); // Import the verifyToken middleware

// Apply verifyTokenAdminRoutes middleware to all routes in this router
router.use(verifyTokenStaffnAdminRoutes);

// Route to add a new resource (accessible only to admins n staff )
router.post("/addresource", addResource);

// Route to get all resources (accessible only to admins  admins n staff  )
router.get("/getresource", getResource);

// Route to update a resource by ID (accessible only to admins  admins n staff  )
router.put("/updateresource/:id", updateResource);

// Route to delete a resource by ID (accessible only to admins  admins n staff )
router.delete("/deletesessions/:id", deleteResource);

// Route to book a resource by ID (accessible only to admins)
router.put("/bookresource/:id", bookResource);

module.exports = router;