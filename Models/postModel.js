const mongoose = require('mongoose');

// Define user schema
const postSchema = new mongoose.Schema({   
    caption: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    },
  
    timestamp:{
        type:String
    },
    like:{
              type:Array,
    },
    dislike:{
              type:Array,
    },
    comments:[
              {
                        user:{
                                  type:mongoose.Schema.ObjectId,
                                  required:true
                        },
                        username:{
                                  type:String,
                                  required:true
                        },
                        profile:{
                                  type:String
                        },
                        comment:{
                                  type:String,
                                  required:true
                        }
              }
    ]
});

// Create user model
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
