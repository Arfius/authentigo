/**
 * Created by alfonso on 19/02/17.
 */
var mongoose = require('mongoose')
    , LocalStrategy = require('passport-local').Strategy,
    user = mongoose.model('users');
    var sha1 = require('sha1');
    var debug= require('debug')('passport.local.config')

module.exports = function (passport)
{
    passport.serializeUser(function(user, done) {
        debug('serializeUser')
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        debug('deserializeUser')
        done(null, user);
    });

    passport.use(new LocalStrategy(function(username, password, done)
    {
        debug('use with LocalStrategy')

        user.findOne({ username : username, enabled:true }, function(err,user)
        {

            if(err) {
                debug('findOne with error:' + err )
                return done(err);
            }

            if(!user){
                debug('findOne with user not found' )
                return done(null, false, { message: 'error login.' });
            }

            debug("Authentication:"+username+" "+password )

            if(username==user.username && sha1(password) == user.password)
            {
                debug('findOne with user found' )

                return done(null, user);
            }else
            {
                debug('findOne with Incorrect login.' )
                return done(null, false, { message: 'Incorrect login.' });
            }
        });

    }));

}
