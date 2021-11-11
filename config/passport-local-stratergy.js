const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, 
    function(req,email,password,done){
        //done is inbuilt function of passport, 2 args first one os error and boolean (if auth successful then user else false)
        //Find a user and establish the identity
        User.findOne({email:email},function(err,user){
            if(err){
                req.flash('error', err);
                return done(err); 
            }
            if(!user || user.password!=password || user.verified==false){
                // req.flash('error', 'Invalid Username or Password');
                req.flash('error', ' Please try again with correct credentials or Create a new account. Link given below!')
                // console.log("Invalid Username/password");
                return done(null,false);
            }
            return done(null,user);
        });
    }
));

//Serialize user function, encrypt user id cookie 
//Basically take user id and make a cookie of it
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//Deserialize the cookie
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(!err){   
            return done(null,user);
        }
    });
});

// Check if current user is authenticated or not
passport.checkAuthentication = function(req,res,next){
    //If the user is signed in, then go to next. As this will be used as a middleware.
    if(req.isAuthenticated()){
        // console.log(req.user);
        return next();  
    }
    // If user isn't signed in
    return res.redirect('/users/sign-in');
};


passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user cookie. We are sending this to locals for views
        // req.user, Passport adds the user to the request 
    // console.log("IN here");
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;