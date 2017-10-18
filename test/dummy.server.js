/**
 * Created by alfonso on 16/08/17.
 */
const express = require('express')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const app = express()
const router = express.Router()
var session = require('express-session')
var debug = require('debug')('DummyServer')
// load models

var memberSchema = require('./member')
var  member = mongoose.model('members');

var authsetting= require('./authentigo.json')

debug('DUMMY SERVER AuthentiGo')

var authentigo=require('../index.js');
console.log(authentigo)
authentigo.settings(authsetting)
authentigo.init(app,router,[member]);

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


app.use(router);
var server = app.listen(port, function ()
{
    var _host = server.address().address;
    var _port = server.address().port;
    debug("Listening->"+_host+"@"+_port);
});


module.exports = server;
