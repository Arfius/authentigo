/**
 * Created by alfonso on 19/02/17.
 */

var registration= require('../registration/registration');
var debug= require('debug')('Authentigo:passport.route');
var code= require('../config/code');

module.exports = function(app,passport)
{
    debug('login_url '+process.env.authentigo_url_prefix)
    app.post(process.env.authentigo_url_prefix+'/login', function(req, res, next)
    {
        passport.authenticate('local', function(err, user, info)
        {
            if (err) {
                debug("login-error " + JSON.stringify(err))
                return next(err);
            }

            if (!user) {
                debug("login-user-not-found")
                return res.status(404).json(code[404]);
            }

            req.logIn(user, function(err) {

                if (err) {
                    debug.log("login-ok-but-error")
                    return next(err);
                }

                var newuser=user.toObject();
                delete newuser['password'];
                delete newuser['deleted'];
                delete newuser['enabled'];
                delete newuser['created'];
                delete newuser['salt'];
                newuser.code=200;
                debug("login-ok" + newuser._id)
                return res.status(200).json(newuser);
            });
        })(req, res, next);
    });

    app.get(process.env.authentigo_url_prefix+'/logout', function(req, res)
    {
        debug("logout-user");
        req.logOut();
        req.session.destroy();
        res.clearCookie('connect.sid');
        req.logout();
        req.session=null;
        res.status(200).json(code[200]);
    });

    app.get(process.env.authentigo_url_prefix+'/check',function(req,res)
    {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            debug("check - not auth")
            res.status(401).send(code[401])
        } else {
            debug("check - auth ok")
            res.status(200).send(code[200])
        }
    });

    app.post(process.env.authentigo_url_prefix+'/registration', registration.registration);

    app.get(process.env.authentigo_url_prefix+'/confirm/:id', registration.confirm);

    app.post(process.env.authentigo_url_prefix+'/forgot', registration.forgot);


};
