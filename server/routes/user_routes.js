const express = require('express');
const {
  signUp,
  logIn,
  verifyToken,
  getUser,
  logOut,
  getUserData,
  deleteAUser,
  updateUser,
  updateUserCourses
} = require("../controllers/user_controller");

const router = express.Router();
const { verifyTokenAdminRoutes } = require("../controllers/token_controller");

// Route to update user courses by ID
router.put("/updateusercourses/:id", updateUserCourses);

// Route to sign up a new user
router.post("/signup",verifyTokenAdminRoutes , signUp);

// Route to log in a user
router.post("/login", logIn);

// Route to get user data by verifying token
router.get("/user", verifyToken, getUser);

// Route to log out a user by verifying token
router.post("/logout", verifyToken, logOut);

// Route to get user data by verifying token
router.get("/getuserdata", verifyToken, getUserData);

// Route to update user by ID and verifying token
router.put("/updateuser/:id", verifyToken, updateUser);

// Route to delete a user by ID and verifying token for admin routes
router.delete("/removeuser/:id", verifyTokenAdminRoutes, deleteAUser);

module.exports = router;
