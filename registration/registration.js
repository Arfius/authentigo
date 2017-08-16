/**
 * Created by alfonso on 27/04/17.
 */

var debug= require('debug')('registration');
var mongoose = require('mongoose')
    , User = mongoose.model('user')
    ,_ = require('underscore')
    , localmail = require('../mailer/local.mailer');

var shortid = require('shortid');
var sha1 = require('sha1');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$#');

function generatePassword()
{
    var salt=shortid.generate();

    return pass_salt={
        salt: salt,
        password: sha1(salt)
    }
}


var saveAccount= function(new_account,res)
{
    new_account.save(function(error,success)
    {
        if(error)
        {
            debug("registration-end-error",error);
            res.status(400).json(error);
        }else
        {
            var actLink= process.env.web_url+'confirm/'+success._id;
            localmail.sendRegistrationMail(success.username,actLink).then(
                function(resolve)
                {
                    debug("registration-end-success");
                    res.status(200).json(success);
                },
                function(reject)
                {
                    debug("registration-end-error-after-mail",reject);
                    res.status(400).json(reject);
                }
            )


        }
    })
}

module.exports.registration=function (req, res, next)
{
    debug("registration init");

    var account = req.body;
        var new_account= new User();
        new_account.username=account.email;
        saveAccount(new_account,res);
}


module.exports.confirm=function (req, res, next)
{
    User.findOneAndUpdate({_id: req.params.id}, {enabled:true}, function(err, doc)
    {
        if(err){
            debug("confirm-end-error",err);
            res.status(400).json(err);
        }else
        {
            if(doc.enabled==true)
            {
                debug("confirmed-end-succes");
                res.redirect(process.env.url_address+'/#!/userenabled');
            }else
            {
                localmail.sendAccountMail(doc).then(
                    function(resolve)
                    {
                        debug("confirm-end-succes");
                        res.redirect(process.env.url_address+'/#!/userenabled');
                    },
                    function(reject)
                    {
                        debug("registration-end-error-after-mail",reject);
                        res.redirect(process.env.url_address+'/#!/error');
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
            res.status(400).json(err);
        }else
        {

            if(doc)
            {
                if(doc.enabled==false)
                {
                    debug("forgot-findOne-end-no-enable",req.body.username);

                    var actLink= process.env.web_url+'confirm/'+doc._id;

                    localmail.sendRegistrationMail(doc.username,actLink).then(
                        function(resolve)
                        {
                            debug("forgot-findOne-end-no-enable-success",resolve);
                            res.status(200).json(resolve);
                        },
                        function(reject)
                        {
                            debug("forgot-findOne-end-no-enable-error",reject);
                            res.status(400).json(reject);
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
                            res.status(400).json(err);
                        }else
                        {
                            localmail.sendAccountMail(doc2).then(
                                function(resolve)
                                {
                                    debug("forgot-end-succes-after-mail");
                                    res.status(200).json(true);
                                },
                                function(reject)
                                {
                                    debug("forgot-end-error-after-mail",reject);
                                    res.status(400).json(err);
                                }
                            )

                        }
                    });


                }

            }else
                res.status(200).json(true);

        }

    });

}
