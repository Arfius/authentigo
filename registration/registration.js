/**
 * Created by alfonso on 27/04/17.
 */

var debug= require('debug')('Authentigo:registration');
var mongoose = require('../mongoose/mongoconfig').aut_mongoose
    , User = mongoose.model('users')
    ,_ = require('underscore')
    , localmail = require('../mailer/local.mailer')
    , code = require('../config/code');

var shortid = require('shortid');
var sha1 = require('sha1');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$#');

function generatePassword()
{
    var salt=shortid.generate();

    return pass_salt={
        salt: salt,
        password: sha1(salt+""+salt)
    }
}


var saveAccount= function(new_account,res)
{
    new_account.save(function(error,success)
    {
        if(error)
        {
            debug("registration-end-error",error);
            res.status(500).json(code[500]);
        }else
        {
            var actLink= process.env.authentigo_web_url+'/confirm/'+success._id;
            localmail.sendRegistrationMail(success.username,actLink).then(
                function(resolve)
                {
                    debug("registration-end-success");
                    res.status(200).json(code[200]);
                },
                function(reject)
                {
                    debug("registration-end-error-after-mail",reject);
                    res.status(400).json(code[400]);
                }
            )


        }
    })
}

module.exports.registration=function (req, res, next)
{
    debug("registration init");
    var g_pass= generatePassword();
    var account = req.body;
        var new_account= new User();
        new_account.username=account.email;
        new_account.salt=g_pass.salt;
        new_account.password=g_pass.password;

        saveAccount(new_account,res);
}


module.exports.confirm=function (req, res, next)
{
    User.findOneAndUpdate({_id: req.params.id}, {enabled:true}, function(err, doc)
    {
        if(err){
            debug("confirm-end-error",err);
            res.status(500).json(code[500]);
        }else
        {
            if(doc.enabled==true)
            {
                debug("confirmed-end-succes");
                res.redirect(process.env.authentigo_success_page);
            }else
            {
                localmail.sendAccountMail(doc).then(
                    function(resolve)
                    {
                        debug("confirm-end-succes");
                        res.redirect(process.env.authentigo_success_page);
                    },
                    function(reject)
                    {
                        debug("registration-end-error-after-mail",reject);
                        res.redirect(process.env.authentigo_failure_page);
                    }
                )
            }

        }

    });

}

module.exports.forgot=function (req, res, next)
{

    User.findOne({username: req.body.username}, function(err, doc)
    {
        if(err)
        {
            debug("forgot-findOne-end-error",err);
            res.status(500).json(code[500]);
        }else
        {

            if(doc)
            {
                if(doc.enabled==false)
                {
                    debug("forgot-findOne-end-no-enable",req.body.username);

                    var actLink= process.env.authentigo_web_url+'/confirm/'+doc._id;

                    localmail.sendRegistrationMail(doc.username,actLink).then(
                        function(resolve)
                        {
                            debug("forgot-findOne-end-no-enable-success",resolve);
                            res.status(200).json(code[200]);
                        },
                        function(reject)
                        {
                            debug("forgot-findOne-end-no-enable-error",reject);
                            res.status(400).json(code[400]);
                        }
                    )

                }else
                {
                    var pass_salt= generatePassword();
                    User.findOneAndUpdate({username: req.body.username}, pass_salt, { "new": true}, function(err, doc2)
                    {
                        if(err)
                        {
                            debug("forgot-findOneAndUpdate-end-error",err);
                            res.status(500).json(code[500]);
                        }else
                        {
                            localmail.sendAccountMail(doc2).then(
                                function(resolve)
                                {
                                    debug("forgot-end-succes-after-mail");
                                    res.status(200).json(code[200]);
                                },
                                function(reject)
                                {
                                    debug("forgot-end-error-after-mail",reject);
                                    res.status(400).json(code[400]);
                                }
                            )

                        }
                    });
                }

            }else
                res.status(200).json(code[200]);

        }

    });

}
