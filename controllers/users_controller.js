const User = require('../models/users');
const Post = require('../models/posts');
const fs = require('fs');
const path = require('path');
const mailer = require('../mailers/emails');

module.exports.profile = function(req,res){
    User.findById(req.params.id,function(err,user){
        Post.find({user:user})
        .populate('user')
        .populate({
            path: 'comments',
            populate : {
                path: 'user'
            }
        })
        .exec(function(err,posts){
                // console.log(posts);
                return res.render('user_profile',{profile_user:user,posts:posts,update:false});
            });
    });
};

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile/'+req.user._id);
    }
    return res.render('user_sign_up',{
        title:'Codeial'
    });
};

module.exports.signIn = function(req,res){
    // console.log(req.user);
    if(req.isAuthenticated() && req.user.veried == true){
        return res.redirect('/users/profile/'+req.user._id);
    }
    return res.render('user_sign_in',{
        title:'Codeial'
    });
};

module.exports.create = function(req,res){
    // console.log("Here");
    if(req.body.password!=req.body.confirmPassword){
        req.flash('error',"Your passwords do not match, please try again!");
        // console.log("Here 2.0");
        return res.redirect('/users/sign-up');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(!user){
            req.body.verified = false;
            req.body.linkedin="";req.body.twitter="";req.body.github="";req.body.description="";
            User.create(req.body,function(err,userr){
                // Send mail
                mailer.newEmail(userr);
                req.flash('success',"Please check your e-mail!");
                return res.redirect('/users/sign-in');
            });
        } else{
            req.flash('error',"Looks like you already have an account! Please sign-in instead");
            return res.redirect('/users/sign-in');
        }
    });
}

module.exports.verify = function(req,res){
    User.findById(req.params.id,function(err,user){
        if(user){
            if(user.verified == true){
                req.flash('error',"Email already verified, please sign in!");
                return res.redirect('/users/sign-in');
            } else{
                user.verified = true;
                user.save();
                req.flash('success',"Email verified! Please sign in!");
                return res.redirect('/users/sign-in');
            }
        } else{
            // console.log("Error in verification ",err);
            req.flash('error',"No such user found!");
            return res.redirect('back');
        }
    })
    
}

module.exports.forgotPassword = function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        // console.log(user);
        if(err || !user || user.verified==false){
            // console.log("Error in forgot pass, user not found",err);
            req.flash('error',"No such user found!");
            return res.redirect('/users/sign-in');
        } else{
            // Send mail;
            mailer.newPassword(user);
            req.flash('success',"Please check your email to reset your password!");
            return res.redirect('/users/sign-in');
        }
    });
}

module.exports.displayForgotPassword = function(req,res){
    let id = req.params.id;
    return res.render('input_new_password',{id:id});
}

module.exports.handleForgotPassword = function(req,res){
    let id = req.params.id;
    if(req.body.password==req.body.rePassword){
        User.findById(id, function (err, user){
            user.password = req.body.password;
            user.save();
            req.flash('success',"Your password has been updated! Sign-in");
            return res.redirect('/users/sign-in');
        });
    } else{
        req.flash('error',"Please enter matching passwords");
        return res.redirect("back");
    }
}

// module.exports.update = async function(req,res){
//     // if(req.user.id == req.params.id){
//     //     User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
//     //         return res.redirect('/');
//     //     });
//     // } else return res.status(401).send('Unauthorized');
//     if(req.user.id == req.params.id){
//         try{
//             let user = await User.findById(req.params.id);
//             User.uploadedAvatar(req,res,function(err){
//                 if(err) throw err;
//                 else{
//                     user.name = req.body.name;
//                     user.email = req.body.email;
//                     if(req.file){
//                         // Deleting the previously uploaded profile picture if it exists. We need file system of the computer and the path for it.
//                         if(user.avatar){
//                             if(fs.existsSync(path.join(__dirname,'..'+user.avatar))){
//                                 fs.unlinkSync(path.join(__dirname,'..'+user.avatar));
//                             } else console.log("NOT There");
//                         }

//                         // This is saving the path of the uploaded file into the avatar field in the user
//                         user.avatar = User.avatarPath + '/' + req.file.filename;
//                     }
//                     user.save();
//                     return res.redirect('back');
//                 }
//             });
//         } catch(err){
//             return res.redirect('back');
//         }
//     }else return res.status(401).send('Unauthorized');
// }

module.exports.update = async function(req, res){
    let userId = req.params.id;
    try{
        // console.log(!req.body.password); 
        let user = await User.findById(userId);
        if(!req.body.password){
            User.findByIdAndUpdate(userId,req.body,function(err,user){
                // if(err){
                //     console.log(err);
                // }
                return res.redirect('/users/profile/'+userId);
            });
        }else{
            if(req.body.password == user.password){
                // console.log("In update");
                if(req.body.newPassword == req.body.reNewPassword){
                    user.password = req.body.newPassword;
                    user.save();
                    Post.find({user:user})
                    .populate('user')
                    .populate({
                        path: 'comments',
                        populate : {
                            path: 'user'
                        }
                    })
                    .exec(function(err,posts){
                            // console.log(posts);
                            return res.render('user_profile',{profile_user:user,posts:posts,update:true});
                        });
                } else{
                    req.flash('error',"Please enter matching passwords");
                    return res.redirect("back");
                }
            }else{
                req.flash('error',"Please enter correct current password");
                return res.redirect("back");
            }
        }
    } catch(err){
        // console.log("Error in update ",err);
        req.flash('error',"An error occurred. Please try again");
        return res.redirect('/');
    }
}

module.exports.updateDisplay = function(req, res){
    return res.render('user_update', {
        profile_user: req.user.name
    });
};

module.exports.showPass = function(req,res){
    return res.render('change_password', {
        profile_user: req.user.name
    });
}

module.exports.createSession = function(req,res){
    // console.log('Logged in Successfully');
    req.flash('success', 'Signed in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('error', 'You have logged out!');
    return res.redirect('/users/sign-in');
}