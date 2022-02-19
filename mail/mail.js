require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const user = process.env.user;
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const refreshToken = process.env.refreshToken;
const OAuth2_client = new OAuth2( clientId, clientSecret);
OAuth2_client.setCredentials({
    refresh_token: refreshToken,
});

module.exports = function send_mail(recipient , subject , message) {
    const accessToken = OAuth2_client.getAccessToken();

    const transport = nodemailer.createTransport({
        service:"gmail",
        auth: {
            type:"OAuth2",
            user:user,
            clientId:clientId,
            clientSecret:clientSecret,
            refreshToken: refreshToken,
            accessToken:accessToken,
        },
        tls:{
            rejectUnauthorized:false,
        }
    });

    const mailOptions = {
        from: `"Its Srijit" <${user}>`, // sender address
        to: recipient, // list of receivers
        subject: subject, // Subject line
        html: message, // html body
    };

    transport.sendMail(mailOptions , (err, result)=>{
        if(err)
        {
            console.log("Error :" ,   err);
        }
        else
        {
            console.log("Success :" , result);
        }
        transport.close();
    });
    return;
}
