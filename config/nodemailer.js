const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.HOST,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false,
      },
});

let renderTemplate = (data,relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err,template) {
            if(err){
                console.log("Error in rendering template");
                return;
            }
            else mailHTML = template;
        }
    );
    return mailHTML;
};

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
};