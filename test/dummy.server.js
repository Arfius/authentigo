/**
 * Created by alfonso on 16/08/17.
 */
const express = require('express')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const app = express()
const router = express.Router()
var session = require('express-session')

// load models
require('../index.js').init(app,router);

// configure middleware
var url="http://localhost:3210"
var url_prefix="/api/v1/"

process.env.url_address=url;
process.env.web_url=url+url_prefix;
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
var server = app.listen(3210, function ()
{
    var host = server.address().address;
    var port = server.address().port;
    console.log('Dummy Server Listening at http://localhost:3210');
});


module.exports = server;
