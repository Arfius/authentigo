
var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
var debug= require('debug')('Authentigo:mongoconfig');
debug("Export");
exports.aut_mongoose=mongoose;

require('./mongomodel');
require('./initdatabase').init();