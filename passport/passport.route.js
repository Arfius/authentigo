/**
 * Created by alfonso on 19/02/17.
 */

var registration= require('../registration/registration');
var debug= require('debug')('Authentigo:passport.route');
var code= require('../config/code');
var sendNotifyLoginMail = require("../mailer/local.mailer").sendNotifyLoginMail

var isAlarmOn = function(){
    let today = new Date();
    
    if(today.getDay() == 6 || today.getDay() == 0)
        return true; 
    
    let now_minute = new Date().getHours() + ( new Date().getMinutes()/100); 
    let upper = parseFloat(process.env.authentigo_notify_login_h_upper);
    let lower = parseFloat(process.env.authentigo_notify_login_h_lower);

    if(now_minute < lower  || now_minute >upper )
        return true;

}

var notifyAccess = function(user, is_login){
    if(process.env.authentigo_notify_login_enabled){
        if(isAlarmOn()){
            
            var options=
            {
                timeZone: "Europe/Rome",
                year: "numeric",
                month: "numeric",
                day: "2-digit",
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit"
            }

            var data_login = new Date().toLocaleString("it-IT", options)
            
            var compo = data_login.split('/')
            var data_ok = compo[1]+'/'+compo[0]+'/'+compo[2]

            var titolo = "[Logout] ["+ user.name + "]";
            var corpo = "L'utente:"+ user.name +" ha effettuato il logout il "+data_ok;

            if (is_login==true){
                titolo = "[Login] ["+ user.name + "]";
                corpo = "Nuovo Login da parte dell'utente:"+ user.name +" @ "+data_ok;
            }
            
            sendNotifyLoginMail(process.env.authentigo_notify_login_email,titolo,corpo);

        }
    }
}

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
                notifyAccess(user, true)
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
        var user = req.user
        req.logOut();
        req.session.destroy();
        res.clearCookie('connect.sid');
        req.logout();
        req.session=null;
        notifyAccess(user, false)
        res.status(200).json(code[200]);
    });

    app.get(process.env.authentigo_url_prefix+'/check',function(req,res)
    {
            
        if (!req.isAuthenticated || !req.isAuthenticated()) {            
            debug("check - not auth")
            res.status(401).send(code[401])
        } else {
            var use = req.sessionID;
            var uid = req.session.passport.user;

            debug(`Current - auth ok Session:${use} - User:${uid}`)            
            if (process.env.authentigo_use_single_session === "false"){
                res.status(200).send(code[200])
                return
            }
            
            var conflict = false;
            var session_per_user = []

            for (var key in req.sessionStore.sessions) {
                var curr_session = JSON.parse(req.sessionStore.sessions[key])
                debug(`checking - Session:${key}`)            

                if( curr_session.passport!= undefined && curr_session.passport.user == uid){
                    session_per_user.push(key)
                }
            }

            if(session_per_user.length>1){
                conflict= true;

                session_per_user.forEach(
                    e=>{
                        req.sessionStore.destroy(e, function(data,error){
                        });
                    }
                )

                req.session.destroy();
            }

            if (conflict){
                res.status(409).send(code[409])
            }else{
                res.status(200).send(code[200])
            }
        }
    });

    app.post(process.env.authentigo_url_prefix+'/registration', registration.registration);

    app.get(process.env.authentigo_url_prefix+'/confirm/:id', registration.confirm);

    app.post(process.env.authentigo_url_prefix+'/forgot', registration.forgot);


};
