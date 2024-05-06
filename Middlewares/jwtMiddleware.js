// middleware function: token verification

const jwt = require('jsonwebtoken');
const User = require('../Models/userModel'); // Import the User model

exports.middlewareFunction = async (req, res, next) => {
    console.log("________inside middleware function________");

    try {
        // token
        // `bearer ${token}`
        const token = req.headers['access_token'].split(" ")[1]

        // verify
        const jwtResponse = jwt.verify(token, process.env.JWT_SECRET_KEY)

        // store the user id payload in req payload
        req.payload = jwtResponse.uid;

        // Fetch the user from the database based on the user ID
        const user = await User.findById(req.payload);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Set req.user with the user object
        req.user = user;

        next();
    } catch {
        res.status(401).json("Authentication failed please login again")
    }
}
