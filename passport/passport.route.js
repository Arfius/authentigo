/**
 * Created by alfonso on 19/02/17.
 */

var registration= require('../registration/registration');
var debug= require('debug')('passport.route');
var code= require('../config/code');

module.exports = function(app,passport)
{

    app.post('/login', function(req, res, next)
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

                debug("login-ok" + newuser._id)
                return res.status(200).json(newuser);
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res)
    {
        debug("logout-user");
        req.logOut();
        req.session.destroy();
        res.clearCookie('connect.sid');
        req.logout();
        req.session=null;
        res.status(200).json(code[200]);
    });

    app.get('/check',function(req,res)
    {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            debug("check - not auth")
            res.status(401).send(code[401])
        } else {
            debug("check - auth ok")
            res.status(200).send(code[200])
        }
    });

    app.post('/registration', registration.registration);

    app.get('/confirm/:id', registration.confirm);

    app.post('/forgot', registration.forgot);


};
