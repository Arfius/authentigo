/**
 * Created by alfonso on 27/04/17.
 */
var nodemailer = require('nodemailer');
var mongoose = require('mongoose')
var debug=require('debug')('Authentigo:local.mailer')

var configMail= {
    host: process.env.mailer_host,
    port: process.env.mailer_port,
    auth: {
        user: process.env.mailer_auth_user,
        pass: process.env.mailer_auth_pass
    },
    tls: {
        rejectUnauthorized: process.env.mailer_tls_rejectUnauthorized
    }};

    module.exports.sendNotifyLoginMail= function(to,titolo,corpo_email)
    {
        debug('sendNotifyLoginMail')
        var transporter = nodemailer.createTransport(configMail);
        // setup email data with unicode symbols
        var mailOptions = {
            from: process.env.mailer_address, // sender address
            to: to,
            subject: titolo, // Subject line
            text: "corpo_email", // plain text body
            html: corpo_email // html body
        };
    
        return transporter.sendMail(mailOptions);
    
    }

module.exports.sendRegistrationMail= function(to,link)
{
    debug('sendRegistrationMail')
    var transporter = nodemailer.createTransport(configMail);
    // setup email data with unicode symbols
    var mailOptions = {
        from: 'info@itsapp.it', // sender address
        to: to,
        subject: 'Conferma Account ', // Subject line
        text: 'Salve', // plain text body
        html: '<b>Salve, </br> per attivare il suo account clicca il seguente link <br/> <a href="'+link+'">Conferma l\'iscrizione</a><br/>Lo Staff di example</b>' // html body
    };

    return transporter.sendMail(mailOptions);

}

module.exports.sendAccountMail= function(account)
{
    debug('sendAccountMail')

    var transporter = nodemailer.createTransport(configMail);

    // setup email data with unicode symbols
    var mailOptions = {
        from: 'info@itsapp.it', // sender address
        to: account.username,
        subject: 'Benvenuto in example', // Subject line
        text: 'Salve', // plain text body
        html: '<b>Salve, </br> il suo account è il seguente <br/> username: '+ account.username+'<br/> password: '+ account.salt+
        '<br/>Lo Staff</b>'+'<br/><a href="'+process.env.authentigo_url_address+'">Clicca qui per accedere al portale</a>'
// html body
    };

    return transporter.sendMail(mailOptions);
}
