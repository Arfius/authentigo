/**
 * Created by alfonso on 19/02/17.
 */
/**
 * Created by alfonso on 04/09/16.
 */
var mongoose = require('../mongoose/mongoconfig').aut_mongoose;
var Schema = mongoose.Schema;
var shortid = require('shortid');
var debug= require('debug')('Authentigo:user.schema');




var user = new Schema({
    name:{ type: String},
    username: { type: String, lowercase: true, trim: true, required: true, unique: true },
    token: { type: String },
    password: { type: String, required:true },
    salt: { type: String ,  required:true },
    role: { type: String,  enum: ['admin','master','slave'], default:"admin", require:true },
    deleted: { type: Boolean,default:false },
    enabled: { type: Boolean, default:false},
    created: { type: Date, default:Date.now},
});

mongoose.model('users', user);
module.exports = user;
