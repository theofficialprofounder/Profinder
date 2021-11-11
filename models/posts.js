const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    }, 
    title:{
        type:String,
        required:true
    },
    skills:{
        type:String,
        required:true
    },
    user:{
        //Every object in db has unique address and this stores that
        type: mongoose.Schema.Types.ObjectId,
        //Refer to which type of Schema
        ref: 'User' 
    },
    //Include the array of ids of all comments in this post Schema itself
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},{
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;