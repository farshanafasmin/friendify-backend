const express = require('express');
const { register, login, getProfile, editProfile, getRegisteredUsers, getUserById, followUser,  getFollowedUsers, unfollowUser } = require('../Controllers/userController');
const { addPost, editPost, getPost, getLuPost, getAPost, likePost, deletePost, commentPost } = require('../Controllers/postController');
const { middlewareFunction } = require('../Middlewares/jwtMiddleware');

const router = express.Router();

router.post('/add-new-user', register);

router.post('/login', login);

router.get('/get-profile/:id',middlewareFunction,getProfile)

router.put('/edit-profile/:id',middlewareFunction,editProfile)

router.post('/add-post',middlewareFunction, addPost);

router.put('/edit-post/:_id',middlewareFunction,editPost)

router.get('/get-all-post',middlewareFunction,getPost)

router.get('/get-all-users',middlewareFunction,getRegisteredUsers)

router.get('/get-user-byid/:id',middlewareFunction,getUserById)

router.get('/get-lu-post/:id',middlewareFunction,getLuPost)

router.get('/get-single-post/:id',middlewareFunction,getAPost)

router.put('/like-post/:id',middlewareFunction,likePost)

router.delete('/delete-post/:id',middlewareFunction,deletePost)

router.post('/follow-user/:id',middlewareFunction,followUser)

router.get('/get-followers/:id',middlewareFunction,getFollowedUsers)

router.delete('/unfollow-user/:username', unfollowUser);

router.put('/comment-post/:id',middlewareFunction,commentPost)












module.exports = router;
