/**
 * Created by alfonso on 10/02/17.
 */
/**
 * Created by alfonso on 22/02/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var  member = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    codfisc: { type: String, required: true,  unique: true  },
    sex:
    {
        value:{ type: Boolean, required:true }
        ,text:{ type: String }
    }
});

mongoose.model('members', member);
module.exports = member;
