/**
 * Created by alfonso on 20/02/17.
 */

exports.init = function(app,router)
{
    require('./passport/passport.config')(app);
    require('./config/config')(router);
}
