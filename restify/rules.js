/**
 * Created by alfonso on 18/10/17.
 */
/**
 * Created by alfonso on 20/02/17.
 */
var _prefix="/api/v1/";
exports.rules=[
    //RULES FOR ADMIN
    {"role":"admin","method":["GET"],"url":_prefix+"members"},


    //RULES FOR MANAGER
    {"role":"master","method":["UPDATE"],"url":_prefix+"members"},


    //RULES FOR OPERATOR
    {"role":"slave","method":["PUT"],"url":_prefix+"members"},

]