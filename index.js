/**
 * Created by alfonso on 20/02/17.
 */
var config = require('config');
var _ = require('underscore');
var debug = require('debug')('Authentigo:');

exports.init = function(app,router)
{

    if(_.isUndefined(process.env.authentigo))
    {
        debug('Missing Authentigo Configuration')
    }else
    {
        debug('Run AuthentiGo')
        require('./mongoose/mongoconfig');
        require('./passport/passport.config')(app);
        require('./config/config')(router);
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
    process.env.authentigo_success_page=page.success_page;
    process.env.authentigo_failure_page=page.failure_page;
}
