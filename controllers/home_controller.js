const Post = require('../models/posts');
const User = require('../models/users');
const Comment = require('../models/comments');

module.exports.home = async function(req,res){
    try{
        let thePosts = await Post.find({})
        // Sorting in the order of new to old
        .sort('-createdAt')
        //Populating user, The schema had the variable user, so populating that
        .populate('user')
        //Populating multiple fields. Syntax is the following
        .populate({
            //Populating comments for a specific post, schema had variable comments.
            path: 'comments',
            //Nesting of populate
            //Populating the user of that comment
            populate: {
                path: 'user'
            }
        });
        for(let i = 0;i<thePosts.length;i++){
            thePosts[i].comments.reverse();
        }
        return res.render('home',
        {title:"Profound | Home",
            posts: thePosts,
            searchContent: ""
        });
    } catch(err){
        // console.log(err);
        req.flash('error',"Some error occurred");
        return res.redirect('/');
    }
}

module.exports.admin = function(req,res){
    return res.render('admin-log.ejs');
}

module.exports.adminShow = async function(req,res){
    req.body.username = req.body.username.toLowerCase();
    if(req.body.username == 'aman' || req.body.username=='laya'){
        if(req.body.password == 'wedidit'){
            let posts = await Post.find({});
            let users = await User.find({});
            let comments = await Comment.find({});
            return res.render('admin-show',{posts: posts.length,users:users.length,comments:comments.length});
        } else{
            req.flash('error',"Not an admin, please sign in");
            return res.redirect('/users/sign-in');
        }
    } else{
        req.flash('error',"Not an admin, please sign in");
        return res.redirect('/users/sign-in');
    }
    
}

module.exports.forgotPassword = function(req,res){
    return res.render('forgot_password');
}