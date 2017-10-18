/**
 * Created by alfonso on 20/02/17.
 */
require('../class/rule');
require('../class/user');
var debug = require('debug')('Authentigo:role')
var restify = require('express-restify-mongoose');

var mongoose = require('mongoose');
var  user = mongoose.model('users')
    ,rule = mongoose.model('rules')
    , _ = require('underscore');

var code= require('../config/code');

module.exports=function(restifyconfig,listClass)
{
    debug("init")

    if(process.env.use_role=="true")
    {
        debug("using role")

        for(var i =0; i<listClass.length;i++)
        {
            restify.serve(restifyconfig, listClass[i],{preMiddleware:checkPermission});
        }
    }else
    {
        debug("not using role")

        for(var i =0; i<listClass.length;i++)
        {
            restify.serve(restifyconfig, listClass[i]);
        }
    }

}


var checkPermission=function(req, res,next)
{
    debug("checkPermission - init")
    var url= req.url;
    var method= req.method;


    if (req.user)
    {
        debug("checkPermission - Auth " +  req.user._id)

        _getRolebyUserid(req.user._id).then(
            function (res) {
                debug("checkPermission - _getRolebyUserid-resolve " + url)
                _getRulebyRoleAndUrl(res.role, url).then(
                    function (res) {
                        debug(" checkPermission - _getRulebyRoleAndUrl->  "+ res.method)
                        if (_.indexOf(res.method, method) >= 0) {
                            debug(" checkPermission - _getRulebyRoleAndUrl-resolve "+ method + " 200OK")
                            next();

                        } else {
                            debug(" checkPermission - _getRulebyRoleAndUrl-resolve "+ method + " 401 PeDe")
                            res.status(401).json(code[401]);
                        }
                    },
                    function (err) {
                        res.status(500).json(code[500]);
                    }
                )
            },
            function (err) {
                debug(" checkPermission - _getRolebyUserid-reject "+ err)
                res.status(401).json(code[401]);

            }
        )
    }else
    {
        debug(" checkPermission - _getRulebyRoleAndUrl-notAuthenticated "+ method + "401PeDe")
        res.status(401).json(code[401]);
    }

}

var _getRolebyUserid= function(userid)
{
    debug("_getRolebyUserid "+userid)

    return user.findOne({_id:userid});
}



var _getRulebyRoleAndUrl= function(role,url)
{

    var v= url.split(/[\?,\/]+/);
    url=v[0]+"/"+v[1]+"/"+v[2]+"/"+v[3];

    debug("_getRulebyRoleAndUrl "+url)

    return rule.findOne({role:role,url:new RegExp(url)});
}


