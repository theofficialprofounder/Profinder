require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const db = require('./config/mongoose');
//Used for session cookies.
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-stratergy');
//Used for storing cookies in db.
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// Parsing the request parameters
app.use(express.urlencoded());
app.use(express.static('./assests'));

//Set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//Set Session Config
app.use(session({ 
    name:'profind',
    //To do change secret
    secret: 'blahsomething', 
    saveUninitialized: false,
    resave:false,
    // Telling what time cookie expires. I think netflix uses life time cookie because see, we never logged out :D
    cookie:{
        //maxAge is calculated in ms
        maxAge: (1000*60*100)
    },
    //Saving session cookie
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://sreelaya:mongodbpassword@profinderdb.itoa4.mongodb.net/Profound?retryWrites=true&w=majority",  //(URI FROM.env file)
        autoRemove: 'disabled'
    })
}));


//Telling app to use passport
app.use(passport.initialize());
app.use(passport.session());

// We defined this Function (used as middleware) to store the user in res.locals to access in views
// Only happens if authentication is successful
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setflash);


//Use express router 
app.use('/',require('./routes/index.js'));

app.listen(port);