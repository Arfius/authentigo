
var restify = require('express-restify-mongoose');
var mongoose = require('mongoose');
var  user = mongoose.model('accounts');
var _ = require('underscore');
var sha1= require('sha1');
var debug = require('debug')('config')

module.exports = function(restifyconfig)
{
    debug('User Restify API')
    restify.serve(restifyconfig, user,{preMiddleware:_preMiddleware,contextFilter:_contextFilter, preUpdate:_preUpdate});
}

var _contextFilter=function (model, req, done) {
    done(model.find({ deleted: false }))
}

var _preUpdate= function(req, res, next)
{
    next()
}

var _preMiddleware=function(req, res, next)
{
    next();
}
