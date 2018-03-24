/**
 * Created by alfonso on 20/02/17.
 */
var config = require('config');
var _ = require('underscore');
var debug = require('debug')('Authentigo:index');
var exp={};

exports.init = function(express,router,listModels,rulesList)
{

    if(_.isUndefined(process.env.authentigo))
    {
        debug('Missing Authentigo Configuration')
    }else
    {
        debug('Run AuthentiGo')
        require('./mongoose/mongoconfig');
        require('./passport/passport.config')(express);
        require('./config/config')(router,listModels,rulesList);
        exports.externalpermissioncheck = require('./restify/role').preMiddlewareRestify;
    }
}



exports.settings = function(settings)
{
    debug('Settings AuthentiGo')
    process.env.authentigo="true";
    process.env.authentigo_url_prefix=settings.url.url_prefix;
    process.env.authentigo_port=settings.url.port;
    process.env.authentigo_url_address=settings.url.url;
    process.env.authentigo_web_url=settings.url.url+":"+settings.url.port+settings.url.url_prefix;
    process.env.authentigo_success_page=settings.page.success_page;
    process.env.authentigo_failure_page=settings.page.failure_page;
    process.env.authentigo_prefix_db=settings.use.prefix_db;
    process.env.authentigo_use_role=settings.use.role;
    process.env.authentigo_use_rules=settings.use.rules;
    debug('Settings end')
}

