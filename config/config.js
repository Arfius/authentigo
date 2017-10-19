
var restify = require('express-restify-mongoose');
var mongoose = require('../mongoose/mongoconfig').aut_mongoose;
var  user = mongoose.model('users');
var  rule = mongoose.model('rules');
var _ = require('underscore');
var sha1= require('sha1');
var debug = require('debug')('Authentigo:config')

var rulesList = require('../restify/rules');
var _preMiddleware= require('../restify/role').preMiddlewareRestify;

module.exports = function(restifyconfig,listClass)
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


    debug('Update Rules')
    rule.remove({}, function(err)
    {
        rulesList.rules.forEach(function(value)
        {
            var r = new rule(value);
            r.save();
        });
    })

    debug('User Restify API')
    restify.serve(restifyconfig, user,{preMiddleware:_preMiddleware,contextFilter:_contextFilter, preUpdate:_preUpdate});

    debug('Rule Restify API')
    restify.serve(restifyconfig, rule,{preMiddleware:_preMiddleware,contextFilter:_contextFilter, preUpdate:_preUpdate});
}

var _contextFilter=function (model, req, done) {
    done(model.find({ deleted: false }))
}

var _preUpdate= function(req, res, next)
{
    next()
}
