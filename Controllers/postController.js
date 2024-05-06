const Post = require('../Models/postModel');

const User=require('../Models/userModel')

const jwt = require('jsonwebtoken')

exports.addPost = async (req, res) => {
    const { caption, file } = req.body;

    try {
        // Extract the user ID from the request payload set by the JWT middleware
        const userId = req.payload;

        // Create a new post with the retrieved user ID
        const newPost = new Post({
            caption,
            file,
            userId
        });

        // Save the new post to the database
        await newPost.save();

        // Return the newly created post in the response
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(400).json({ error: "Failed to add post" });
    }
};

// ---------get all post----------------

exports.getPost = async (req, res) => {
    try {
        const AllPosts = await Post.find()
        if (AllPosts) {
            res.status(200).json(AllPosts)
        }
        else {
            res.status(400).json("post empty")
        }

    }
    catch {
        res.status(400).json("get post api failed")
    }
}


// -----------get post by user id----------------

exports.getLuPost = async (req, res) => {
    try {
        const userId = req.payload; 

        // Find all posts created by the logged-in user
        const userPosts = await Post.find({ userId });

        if (userPosts.length > 0) {
            res.status(200).json(userPosts);
        } else {
            res.status(404).json("No posts found for the logged-in user");
        }
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json("Failed to fetch user posts");
    }
};


// ----------------get post by post id-------------

exports.getAPost = async (req, res) => {
    try {
        const postId = req.params.id; 
        
        const userPost = await Post.findById(postId);

        if (userPost) {
            res.status(200).json(userPost);
        } else {
            res.status(404).json("Post not found");
        }
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json("Failed to fetch user posts");
    }
};


// --------edit post------------

exports.editPost = async (req, res) => {
    try {
        const { _id } = req.params;
        const updateData = req.body;

        const updatedPost = await Post.findByIdAndUpdate(_id, updateData, { new: true });

        if (updatedPost) {
            console.log("Post updated:", updatedPost);
            res.status(200).json(updatedPost);
        } else {
            console.log("Post not found for ID:", _id);
            res.status(404).json("Post not found");
        }
    } catch (error) {
        console.error("Error editing post:", error);
        res.status(500).json("Failed to edit post");
    }
};


//------------Like-----------------

exports.likePost = async (req, res) => {
    try {
        const userId = req.user.id
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json("Post not found");
        }
        
        let likeCount = post.like.length;
        let likedByCurrentUser = false;

        if (!post.like.includes(userId)) {
            if (post.dislike.includes(userId)) {
                await post.updateOne({ $pull: { dislike: userId } });
            }
            await post.updateOne({ $push: { like: userId } });
            likeCount++;
            likedByCurrentUser = true;

            return res.status(200).json({ message: "Post has been liked", likeCount, likedByCurrentUser });
        } else {
            await post.updateOne({ $pull: { like: userId } });
            likeCount--;
            return res.status(200).json({ message: "Post has been unliked", likeCount, likedByCurrentUser });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json("Internal server error");
    }
};


// -----------delete post-------------------

exports.deletePost=async(req,res)=>{
    const {postId}=req.params
    console.log("Received postId:", postId);
    try{

        await Post.deleteOne({postId})
        res.status(200).json("post removed")
    }catch {
        res.status(400).json("delete post api failed")
    }
}


// ------Comment -------------
exports.commentPost = async (req, res) => {
    try {
        const { comment, postid } = req.body;

        if (comment && postid) {
            // Adding a new comment
            // Fetch the user from the database based on the user ID
            const user = await User.findById(req.user.id);

            // Check if the user exists and has a profile
            if (!user || !user.profile) {
                return res.status(404).json({ message: "User profile not found." });
            }

            // Create a new comment object
            const newComment = {
                user: req.user.id,
                username: user.username, // Use the username from the fetched user
                comment,
                profile: user.profile // Use the profile from the fetched user
            };

            // Find the post by ID
            const post = await Post.findById(postid);

            // Check if the post exists
            if (!post) {
                return res.status(404).json({ message: "Post not found." });
            }
            let commentCount = post.comments.length;

            // Add the comment to the post
            post.comments.push(newComment);

            // Save the post
            await post.save();

            // Respond with the newly added comment
            return res.status(200).json({ message: "Comment added successfully.", comment: newComment, commentCount });
        } else {
            // Retrieving comments
            const post = await Post.findById(postid).populate('comments.user', 'username profile');
            if (!post) {
                return res.status(404).json({ message: "Post not found." });
            }
            return res.status(200).json({ comments: post.comments });
        }
    } catch (error) {
        console.error("Error adding/retrieving comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
