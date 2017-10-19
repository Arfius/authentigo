
var mongoose = require('mongoose');
var debug= require('debug')('Authentigo:mongoconfig');
require('../class/user.js');
require('../class/rule.js');

var env = process.env.NODE_ENV
debug('Mode:'+env);

if(env == 'production')
  mongoose.connect('mongodb://localhost/'+process.env.prefix_db+'-Authentigo');
else
if(env == 'test')
  mongoose.connect('mongodb://localhost/'+process.env.prefix_db+'-Authentigo-test');
else
  mongoose.connect('mongodb://localhost/'+process.env.prefix_db+'-Authentigo-dev');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback ()
{
  debug('authentigo opened');
});
