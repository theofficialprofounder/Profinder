const Comment = require('../models/comments');
const Post = require('../models/posts');

module.exports.create = function(req,res){
    // console.log("Comment create in");
    let idx,id,content;
    if(typeof(req.body.content)=="string"){
        id = req.body.post;
        content = req.body.content;
    }else{
        for(idx=0;idx<req.body.content.length;idx++){
            if(req.body.content[idx].length>0) break;
        }
        id = req.body.post[idx];
        content = req.body.content[idx];
    }
    Post.findById(id).populate('user').exec(function(err,post){
        let commentn;
        // console.log(post);
        // console.log("Got post");
        if(err || !post){
            // console.log("Could not Get post");
            return res.redirect('/');
        }
        Comment.create({
            content: content,
            user: req.user._id,
            post: id
        },function(err,comment){
            // console.log(req.body.post);
            commentn = comment;
            post.comments.push(comment);
            //Whenever updating anything in the db, always have to save it too.
            post.save();
            if(req.xhr){
                // console.log("YES");
                return res.status(200).json({
                    data:{
                        comment: comment,
                        user: post.user.name,
                        userId: req.user._id,
                        idx: idx,
                        postId: id
                    },
                    message: "Comment created"
                });
            }
            return res.redirect('/');
        });
        // If I add the ajax code here then the data object wasn't having the comment key
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
                    req.flash('error',"Some error occurred");
                    return res.redirect('back');
                }
            });
        } else{
            req.flash('error',"Some error occurred");
            return res.redirect('back');
        }
    });
}

module.exports.delete = function(req, res){
    Comment.findById(req.params.id,function(err,comment){
        // console.log(comment);
        // console.log(req.params.id);
        if(err || !comment){
            // console.log("error in deleting comments "+err);
            // console.log("Kardiya error");
            req.flash('error',"Some error occurred");
            return res.redirect('/');
        } 
        // console.log(comment);
        let postId = comment.post.id;
        comment.remove();
        // The pull thing is just a way to delete from the array
        Post.findByIdAndUpdate(postId,{ $pull:{comments: req.params.id}},function(err,post){
            if(req.xhr){
                return res.status(200).json({
                    postId: postId,
                    commentId: req.params.id,
                    message:"Successfully deleted"
                });
            }else{
                req.flash('error',"Some error occurred");
                return res.redirect('back');
            }
        });
    });
}