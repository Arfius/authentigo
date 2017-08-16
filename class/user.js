/**
 * Created by alfonso on 19/02/17.
 */
/**
 * Created by alfonso on 04/09/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var sha1 = require('sha1');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$#');

function generatePassword()
{
    var salt=shortid.generate();

    return pass_salt={
        salt: salt,
        password: sha1(salt)
    }
}
var pass_salt= generatePassword();


var  user = new Schema({
    username: { type: String, lowercase: true, trim: true, required: true, unique: true },
    token: { type: String },
    password: { type: String, default:pass_salt.password },
    salt: { type: String ,  default:pass_salt.salt },
    deleted: { type: Boolean,default:false },
    enabled: { type: Boolean, default:false},
    created: { type: Date, default:Date.now},
});


mongoose.model('users', user);
module.exports = user;
