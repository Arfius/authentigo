/**
 * Created by alfonso on 19/02/17.
 */

var registration= require('../registration/registration');
var debug= require('debug')('passport.route');

module.exports = function(app,passport)
{

    app.post('/api/v1/login', function(req, res, next)
    {
        passport.authenticate('local', function(err, user, info)
        {
            if (err) {
                debug("login-error " + JSON.stringify(err))
                return next(err);
            }

            if (!user) {
                debug("login-user-not-found")
                return res.status(401).json({error:"User not found"});
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

    app.get('/api/v1/logout', function(req, res)
    {
        debug("logout-user");
        req.logOut();
        req.session.destroy();
        res.clearCookie('connect.sid');
        req.logout();
        req.session=null;
        res.status(200).json({logout:true});
    });

    app.get('/api/v1/check',function(req,res)
    {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            debug("check - not auth")
            res.status(401).send({code:4016})
        } else {
            debug("check - auth ok")
            res.status(200).send({code:2004})
        }
    });

    app.post('/api/v1/registration', registration.registration);

    app.get('/api/v1/confirm/:id', registration.confirm);

    app.post('/api/v1/forgot', registration.forgot);


};
