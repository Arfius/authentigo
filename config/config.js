
var restify = require('express-restify-mongoose');
var mongoose = require('../mongoose/mongoconfig').aut_mongoose;
var  user = mongoose.model('users');
var  rule = mongoose.model('rules');
var _ = require('underscore');
var debug = require('debug')('Authentigo:config')
var _preMiddleware= require('../restify/role').preMiddlewareRestify;


var shortid = require('shortid');
var sha1 = require('sha1');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$#');


module.exports = function(restifyconfig,listClass,rulesList)
{
    debug("init")
    debug("use_role",process.env.authentigo_use_role)

    if(process.env.authentigo_use_role=="true")
    {
        debug("using role")

        for(var i =0; i<listClass.length;i++)
        {
            restify.serve(restifyconfig, listClass[i],{preMiddleware:_preMiddleware});
        }
    }else
    {
        debug("not using role")

        for(var i =0; i<listClass.length;i++)
        {
            restify.serve(restifyconfig, listClass[i]);
        }
    }


    debug('Update Rules',rulesList)
    rule.remove({}, function(err)
    {
        rulesList.forEach(function(value)
        {
            var r = new rule(value);
            r.save();
        });
    })

    debug('User Restify API')
    restify.serve(restifyconfig, user,{preMiddleware:_preMiddleware,contextFilter:_contextFilter, preUpdate:_preUpdate, preCreate:_preCreate});

    debug('Rule Restify API')
    restify.serve(restifyconfig, rule,{preMiddleware:_preMiddleware,contextFilter:_contextFilter});
}

var _contextFilter=function (model, req, done) {
    done(model.find({ deleted: false }))
}

var _preUpdate= function(req, res, next)
{
    debug("_preUpdate:"+req.user.username);

    if(!_.isUndefined(req.body.password))
    {
        req.body.password=sha1(req.user.salt+""+req.body.password);
    }

    next()
}

var _preCreate= function(req, res, next)
{
    debug("_preCreate:"+req.user.username);

    var salt=shortid.generate();

    if(!_.isUndefined(req.body.password))
    {
        req.body.salt=salt;
        req.body.password=sha1(salt+""+req.body.password);
    }

    next()
}
