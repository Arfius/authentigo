
var mongoose = require('mongoose');
var debug= require('debug')('mongoconfig');
require('../class/user.js');

var env = process.env.NODE_ENV
debug('Mode:'+env);

if(env == 'production')
  mongoose.connect('mongodb://localhost/authentigo');
else
if(env == 'test')
  mongoose.connect('mongodb://localhost/authentigo-test');
else
  mongoose.connect('mongodb://localhost/authentigo-dev');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback ()
{
  debug('authentigo opened');
});
