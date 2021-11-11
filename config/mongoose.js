const mongoose = require('mongoose');
const url = "mongodb+srv://sreelaya:mongodbpassword@profinderdb.itoa4.mongodb.net/Profound?retryWrites=true&w=majority"
mongoose.connect(url);
const db = mongoose.connection;
db.on('error',console.error.bind(console,'error connecting to db'));
db.once('open',function(){
    console.log('Successfully connected to database');
});

module.exports = db;