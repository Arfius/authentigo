/**
 * Created by alfonso on 19/02/17.
 */
var mongoose = require('../mongoose/mongoconfig').aut_mongoose
    , LocalStrategy = require('passport-local').Strategy,
    user = mongoose.model('users');
    var sha1 = require('sha1');
    var debug= require('debug')('Authentigo:passport.local.config')
    var code= require('../config/code');

module.exports = function (passport)
{
    passport.serializeUser(function(user, cb) {
        debug('serializeUser',user.id)
        cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
        debug('deserializeUser',id)
        user.findOne({_id:id , enabled:true }, function (err, user) {
            if (err) { return cb(err); }
            cb(null, user);
        });
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
                return done(null, false, code[401]);
            }

            debug("Authentication:"+username+" "+password )

            if(username==user.username && sha1(password) == user.password)
            {
                debug('findOne with user found' )

                return done(null, user);
            }else
            {
                debug('findOne with Incorrect login.' )
                return done(null, false, code[401]);
            }
        });

    }));

}
