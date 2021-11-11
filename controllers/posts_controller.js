const Post = require('../models/posts');
const Comment = require('../models/comments');

module.exports.create = function(req,res){
    // console.log("Making a post");
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user: req.user._id,
        skills: req.body.skills
    },function(err,post){
        if(!err){
            // console.log("Post added to db");
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post: post
                    },
                    message: "Post created!"
                });
            }
            req.flash('info', 'Your project\'s been published!');
            return res.redirect('back');
        } else{
            req.flash('error', 'Please try again!');
            return res.redirect('back');
        }
    });
}

module.exports.destroy = function(req,res){
    Post.findById(req.params.id,function(err,post){
        // post.user has the user id stored as string. So we compare with req.user.id
        // .id gives the string value of the user id.
        if(post.user == req.user.id){
            //Deleting the post
            post.remove();
            //Deleting the comments associated with the post id 
            Comment.deleteMany({post: req.params.id},function(err){
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            post_id: post._id
                        },
                        message: "Post created!"
                    });
                } else{
                    req.flash('error', 'Some error occured');
                    return res.redirect('back');
                }
            });
        } else{
            req.flash('error', 'Some error occured');
            return res.redirect('back');
        }
    });
}

module.exports.send = function(req,res){
    Post.findById(req.params.id)
    .populate({
        path:'comments', 
        populate : {
            path: 'user'
        }
    })
    .exec(function(err,post){
        post.comments.reverse();
        return res.status(200).json({
            comments : post.comments,
            message: "Successfully gave comments!"
        });
    });
}

module.exports.delete = function(req, res){
    Post.findById(req.params.id,function(err,post){
        Comment.deleteMany({post:post.id},function(err){
            if(err){
                let a;
            }
        });
        post.remove();
        req.flash('error', 'The post has been deleted!');
        return res.redirect('back');
    });
}

module.exports.editUtil = function(req, res){
    Post.findByIdAndUpdate(req.params.id,req.body,function(err,post){
        req.flash('success', 'Your post has been updated!');
        return res.redirect('/');
    })
}

module.exports.edit = function(req, res){
    Post.findById(req.params.id,function(err,post){
        return res.render('edit_post.ejs',{post:post});
    });
}

module.exports.custom = async function(req, res){
    let tech = req.query.tech.split(" ");
    // console.log(tech.length);
    for(let i=0;i<tech.length;i++){
        tech[i] = tech[i].toLowerCase();
    }
    // console.log(tech);
    let posts = await Post.find({})
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
    let impPosts = [];
    for(let post of posts){
        let skillss = post.skills.toLowerCase();
        for(let i=0;i<tech.length;i++){
            let idx = skillss.search(tech[i]);
            if(idx!=-1){
                impPosts.push(post);
                break;
            }
        }
    }
    if(impPosts.length){
        req.flash('success', `${impPosts.length} posts found`);
    } else{
        req.flash('error', `No such post found`);
    }
    return res.render('home',
    {
        title:"Profound | Home",
        posts: impPosts,
        searchContent: req.query.tech
    });
}