const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Secret key for JWT
const jwtKey = process.env.JWT_SKEY;

// Function to sign up a new user
const signUp = async (req, res) => {
    const { Email, Password, Type, Name } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ Email: Email });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Server Error" });
    }

    if (existingUser) {
        return res.status(400).json({ message: "User Already Exists" });
    } else {
        const hashedPassword = bcrypt.hashSync(Password);

        const user = new User({ Email: Email, Password: hashedPassword, Type: Type, Name: Name });
        try {
            await user.save();
            console.log("User Registered to the DB");
            return res.status(201).json({ message: user });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Server Error" });
        }
    }
};

// Function to log in a user
const logIn = async (req, res) => {
    const { Email, Password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ Email: Email });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Server Error" });
    }

    if (!existingUser) {
        return res.status(400).json({ message: "User not found. Sign up instead" });
    }

    const isPassCorrect = bcrypt.compareSync(Password, existingUser.Password);
    if (!isPassCorrect) {
        return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({
        id: existingUser._id,
        type: existingUser.Type
    }, jwtKey, { expiresIn: "2hr" });

    res.cookie(String(existingUser._id), token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 36000),
        httpOnly: true,
        sameSite: 'lax'
    });

    return res.status(200).json({ message: "Login Successful", user: existingUser, token });
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    var token = null;
    if (cookies) {
        token = cookies.split("=")[1];
    }

    if (!token) {
        return res.status(404).json({ message: "No token found" });
    }

    jwt.verify(String(token), jwtKey, (err, user) => {
        if (err) {
            return res.status(404).json({ message: "Invalid Token" });
        }
        req.id = user.id;
    });
    next();
};

// Function to get user data
const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "-Password");
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to log out a user
const logOut = (req, res, next) => {
    const cookies = req.headers.cookie;
    var token = null;
    if (cookies) {
        token = cookies.split("=")[1];
    }

    if (!token) {
        return res.status(404).json({ message: "No token found" });
    }

    jwt.verify(String(token), jwtKey, (err, user) => {
        if (err) {
            return res.status(404).json({ message: "Invalid Token" });
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";
        return res.status(200).json({ message: "Logout Complete" });
    });
    next();
};

// Function to get all user data
const getUserData = async (req, res) => {
    try {
        const users = await User.find({}, "-Password");
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to delete a user by ID
const deleteAUser = async (req, res) => {
    try {
        await User.findByIdAndDelete({ _id: req.params.id });
        return res.status(200).json({ Status: "Deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to update a user
const updateUser = async (req, res) => {
    const { Name, Email, Password, Type, Courses } = req.body;
    const hashedPassword = bcrypt.hashSync(Password);

    try {
        await User.findByIdAndUpdate({ _id: req.params.id }, {
            Name: Name,
            Email: Email,
            Password: hashedPassword,
            Type: Type,
            Courses: Courses
        });
        return res.status(200).json({ Status: "Updated" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to update user courses
const updateUserCourses = async (req, res) => {
    try {
        await User.findByIdAndUpdate({ _id: req.params.id }, { Courses: req.body });
        return res.status(200).json({ Status: "Updated" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Exporting the functions
module.exports = {
    updateUserCourses,
    updateUser,
    deleteAUser,
    getUserData,
    logOut,
    signUp,
    logIn,
    verifyToken,
    getUser
};