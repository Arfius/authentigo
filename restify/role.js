/**
 * Created by alfonso on 20/02/17.
 */
var debug = require('debug')('Authentigo:role')
var mongoose = require('../mongoose/mongoconfig').aut_mongoose;
var  user = mongoose.model('users')
    ,rule = mongoose.model('rules')
    , _ = require('underscore');
var code= require('../config/code');

module.exports.preMiddlewareRestify=function(req, _res,next)
{
    debug("checkPermission - init")
    var url= req.url;
    var method= req.method;

    if (req.user && req.user.hasOwnProperty('_id'))
    {
        debug("["+req.user._id+"] checkPermission - Auth " +  req.user._id)

        _getRolebyUserid(req.user._id).then(
            function (res) {
                debug("["+req.user._id+"] checkPermission - _getRolebyUserid-resolve " + url)
                _getRulebyRoleAndUrl(res.role, url).then(
                    function (res) {
                        debug("["+req.user._id+"]  checkPermission - _getRulebyRoleAndUrl->  "+ res.method)
                        if (_.indexOf(res.method, method) >= 0) {
                            debug("["+req.user._id+"]  checkPermission - _getRulebyRoleAndUrl-resolve "+ method + " 200OK")


                            if(!_.isUndefined(req.authentigo_external))
                            {


                                if(req.authentigo_external)
                                {
                                    next(req,_res);
                                }else {
                                    next()
                                }
                            }else
                            {
                                next()
                            }



                        } else {
                            debug("["+req.user._id+"] checkPermission 1 - _getRulebyRoleAndUrl-resolve "+ method + " 401 PeDe")
                            debug(res);
                            _res.status(401).json(code[401]);
                        }
                    },
                    function (err) {
                        _res.status(500).json(code[500]);
                    }
                )
            },
            function (err) {
                debug("["+req.user._id+"]  checkPermission 2 - _getRolebyUserid-reject "+ err)
                _res.status(401).json(code[401]);

            }
        )
    }else
    {
        debug("["+req.user._id+"] checkPermission - _getRulebyRoleAndUrl-notAuthenticated "+ method + "401PeDe")
        _res.status(401).json(code[401]);
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

// MIDDLEWARE




