/**
 * Created by alfonso on 20/02/17.
 */
var mongoose = require('../mongoose/mongoconfig').aut_mongoose;
var Schema = mongoose.Schema;

var  rule = new Schema({
    role:   { type: String, require:true },
    method: [{ type: String, require:true }],
    url:    { type: String, require:true }
});

mongoose.model('rules', rule);
module.exports = rule;
