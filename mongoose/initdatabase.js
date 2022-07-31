/**
 * Created by alfonso on 19/10/17.
 */
var debug= require('debug')('Authentigo:initdatabase');
var mongoose = require('./mongoconfig').aut_mongoose;

exports.init= function()
{
    var env = process.env.NODE_ENV
    debug('Mode: ',env);
    debug('Prefix: ',process.env.authentigo_prefix_db)

    if(env == 'production')
        mongoose.connect('mongodb://localhost/'+process.env.authentigo_prefix_db+'-Authentigo');
    else
    if(env == 'test')
        mongoose.connect('mongodb://localhost/'+process.env.authentigo_prefix_db+'-Authentigo-test');
    else
        mongoose.connect('mongodb://localhost/'+process.env.authentigo_prefix_db+'-Authentigo-dev');


    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function callback ()
    {
        debug('authentigo opened');
    });
}