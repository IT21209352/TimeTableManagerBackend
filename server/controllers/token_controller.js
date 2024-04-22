const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Secret key for JWT
const jwtKey = process.env.JWT_SKEY;

// Middleware to verify token for normal routes
const verifyTokenSep = (req, res, next) => {
    const cookies = req.headers.cookie;
    let token = null;
    if (cookies) {
        token = cookies.split("=")[1];
    }
    if (!token) {
        return res.status(420).json({ message: "No token found" });
    } else {
        jwt.verify(String(token), jwtKey, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Invalid Token" });
            }
            // Include the user's ID and type in the request object
            req.id = decodedToken.id;
            req.type = decodedToken.type;
            console.log("Token Verified for User " + req.id + " type of " + req.type);
            next();
        });
    }
};

// Middleware to verify token for admin routes
const verifyTokenAdminRoutes = (req, res, next) => {
    const cookies = req.headers.cookie;
    let token = null;
    if (cookies) {
        token = cookies.split("=")[1];
    }
    if (!token) {
        return res.status(420).json({ message: "No token found" });
    } else {
        jwt.verify(String(token), jwtKey, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Invalid Token" });
            }
            // Include the user's ID and type in the request object
            req.id = decodedToken.id;
            req.type = decodedToken.type;

            // Check if the user's type is Admin
            if (req.type !== 'Admin') {
                return res.status(403).json({ message: "Unauthorized access" });
            }

            console.log("Token Verified");
            next();
        });
    }
};


const verifyTokenStaffnAdminRoutes = (req, res, next) => {
    const cookies = req.headers.cookie;
    let token = null;
    if (cookies) {
        token = cookies.split("=")[1];
    }
    if (!token) {
        return res.status(420).json({ message: "No token found" });
    } else {
        jwt.verify(String(token), jwtKey, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Invalid Token" });
            }
            // Include the user's ID and type in the request object
            req.id = decodedToken.id;
            req.type = decodedToken.type;

            // Check if the user's type is Admin or staff
            if (req.type !== 'Staff' && req.type !=="Admin") {
                return res.status(403).json({ message: `Unauthorized access ${req.type}` });
            }

            console.log("Token Verified");
            next();
        });
    }
};



// Export the middleware functions
module.exports = {
    verifyTokenAdminRoutes,
    verifyTokenSep,
    verifyTokenStaffnAdminRoutes
}
