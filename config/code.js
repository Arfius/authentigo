/**
 * Created by alfonso on 16/08/17.
 */
var code=[];
code[200]={mess:"OK",code:200};
code[201]={mess:"Created",code:201};
code[204]={mess:"No Content",code:204};

code[304]={mess:"Not Modified",code:304};

code[400]={mess:"Bad Request",code:400};
code[401]={mess:"Unauthorized",code:401};
code[403]={mess:"Forbidden",code:403};
code[404]={mess:"Not Found",code:404};
code[409]={mess:"Conflict",code:409};

code[500]={mess:"Internal Server Error",code:500};

module.exports=code;