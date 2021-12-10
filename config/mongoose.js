const mongoose = require('mongoose');
const url = ""
mongoose.connect(url);
const db = mongoose.connection;
db.on('error',console.error.bind(console,'error connecting to db'));
db.once('open',function(){
    console.log('Successfully connected to database');
});

module.exports = db;
