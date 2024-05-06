const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    Followers:{
              type:Array,
    },
    Following:{
              type:Array,
    }
});

// Create user model
const User = mongoose.model("User", userSchema);

module.exports = User;
