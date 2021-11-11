const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    verified:{
        type: Boolean,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    github:{
        type: String
    },
    twitter:{
        type: String
    },
    linkedin:{
        type: String
    },
    description:{
        type: String
    },
    name:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User',userSchema);
module.exports = User;