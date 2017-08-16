require('../class/user');
const passport = require("passport");
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
var session = require('express-session')
var debug= require('debug')('passport.config');

module.exports=function(app)
{
    debug('passport.config init')
    app.use(bodyParser.json())
    app.use(methodOverride())
    app.use(cookieParser()) // required before session.

    app.use(session({
        secret: '4uth3nt1go',
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    require('./passport.local.config')(passport);
    require('./passport.route')(app,passport);
}