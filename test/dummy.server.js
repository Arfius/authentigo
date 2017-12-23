/**
 * Created by alfonso on 16/08/17.
 */
const express = require('express')
const app = express()
const router = express.Router()
var session = require('express-session')
var debug = require('debug')('Authentigo:DummyServer')

//MONGOOSE
var memberSchema = require('./member')
var mongoose = require('mongoose')
var  member = mongoose.model('members');
mongoose.connect('mongodb://localhost/server-dummy-Authentigo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback ()
{
    debug('server-dummy-Authentigo opened');
});



// load AUTENTIGO
var rulesList = require('./rules.json');
var authsetting= require('./authentigo.json')
debug('DUMMY SERVER AuthentiGo')
var authentigo=require('../index.js');
authentigo.settings(authsetting)
authentigo.init(app,router,[member],rulesList);


// configure middleware
var port=3210


process.env.public_path=__dirname + '/public/';
app.use(express.static(process.env.public_path));


//ALLOWS CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


//RUN SERVER
app.use(router);

app.get('/api/v1/provacheckpermission',function(req, res,next)
{

    var _fun = function(_req, _res)
    {
        debug("provacheckpermission _fun")
        _res.status(200).json({ok:"ok"});
    }

    debug("provacheckpermission check")
    req.authentigo_external=true;
    authentigo.externalpermissioncheck(req, res, _fun);

});



var server = app.listen(port, function ()
{
    var _host = server.address().address;
    var _port = server.address().port;
    debug("Listening->"+_host+"@"+_port);
});




module.exports = server;
