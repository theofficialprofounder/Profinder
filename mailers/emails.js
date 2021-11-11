const nodeMailer = require('../config/nodemailer');


// Similar to module.exports = newComment
module.exports.newEmail = (user)=>{
    console.log('inside new email mailer');

    let htmlString = nodeMailer.renderTemplate({user:user},'/email_verification.ejs')
    nodeMailer.transporter.sendMail({
        from: 'the.official.profounder@gmail.com',
        to: user.email,
        subject: "Email verification!",
        html: htmlString
    },function(err,info){
        if(err){
            console.log("error in sending mail",err);
        } else{
            console.log("Message sent",info);
        }
        return;
    });
}

module.exports.newPassword = (user)=>{
    console.log('inside new password mailer');
    let htmlString = nodeMailer.renderTemplate({user:user},'/email_forgot_pass.ejs')
    nodeMailer.transporter.sendMail({
        from: 'the.official.profounder@gmail.com',
        to: user.email,
        subject: "Forgot Password!",
        html: htmlString
    },function(err,info){
        if(err){
            console.log("error in sending mail",err);
        } else{
            console.log("Message sent",info);
        }
        return;
    });
}