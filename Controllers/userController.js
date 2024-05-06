const users = require("../Models/userModel");

const jwt = require('jsonwebtoken')

// ---------------register-------------------

exports.register = async (req, res) => {
    const { username, email, password, profile } = req.body
    try {
        const user = await users.findOne({ email })
        if (user) {
            res.status(400).json("user already exist,please login")
        }
        else {

            const newUser = new users({
                username, email, password, profile

            })

            await newUser.save()
            res.status(201).json(newUser)

        }
    }
    catch {
        res.status(400).json("register api failed")
    }
}

// -----------get all registered users---------------

exports.getRegisteredUsers = async (req, res) => {
    try {
        const uid=req.payload
        console.log(uid);
        const allUsers = await users.find({ _id: { $ne: uid } });
        console.log(allUsers);
        res.status(200).json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json("Failed to fetch registered users");
    }
};

// -------------login------------------

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await users.findOne({ email, password })
        if (user) {

            // generate token
            const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET_KEY)
            res.status(200).json({ user, token }) //token send to user along with user
        }
        else {
            res.status(401).json("incorrect email or password")
        }
    }
    catch {
        res.status(400).json("login api failed")
    }
}

// -----------get profile------------

exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.id; 
        const user = await users.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
       
        const userProfile = {
            username: user.username,
            email: user.email,
            profile:user.profile,
            password:user.password
            
        };

        res.status(200).json(userProfile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// ---------edit profile------------------

exports.editProfile = async (req, res) => {
    try {
        const userId = req.params.id; 
        const updateData = req.body; 

        // Update the user profile based on the provided userId
        const updatedUser = await users.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// -------get user by id-------------

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch the user by ID from the database
        const user = await users.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user information in the response
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// ---------follow user-----------------------


exports.followUser = async (req, res) => {
    try {
        const { userId, followUserId } = req.body;

        // Find the current user
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Toggle follow status
        if (user.Following.includes(followUserId)) {
            user.Following.pull(followUserId); // Unfollow user
        } else {
            user.Following.push(followUserId); // Follow user
        }
        
        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Follow status toggled successfully' });
    } catch (error) {
        console.error('Error toggling follow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ------------------unfollow user------------------------

exports.unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.params.id; // ID of the current user
        const unfollowUsername = req.params.username; // Username of the user to unfollow

        // Find the current user
        const currentUser = await users.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        // Find the user to unfollow by their username
        const userToUnfollow = await users.findOne({ username: unfollowUsername });
        if (!userToUnfollow) {
            return res.status(404).json({ error: 'User to unfollow not found' });
        }

        // Check if the current user is following the user to unfollow
        if (!currentUser.Following.includes(userToUnfollow._id)) {
            return res.status(400).json({ error: 'Current user is not following the user to unfollow' });
        }

        // Remove the user to unfollow from the current user's following list
        currentUser.Following.pull(userToUnfollow._id);

        // Save the updated current user
        await currentUser.save();

        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




//   --------------get all followers-----------------


exports.getFollowedUsers = async (req, res) => {
    try {
        const userId = req.payload;

        // Find the current user
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch details of followed users
        const followedUserIds = user.Following.map(item => item.followUserId);
        const followedUsersDetails = [];

        for (const followUserId of followedUserIds) {
            const followedUser = await users.findById(followUserId);
            if (followedUser) {
                followedUsersDetails.push({
                    username: followedUser.username,
                    profile: followedUser.profile
                });
            }
        }

        res.status(200).json(followedUsersDetails);
    } catch (error) {
        console.error('Error fetching followed users details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
