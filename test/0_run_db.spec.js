/**
 * Created by alfonso on 27/04/17.
 */


var server;
before(function (done) {
    console.log("Avvio SERVER")
    server = require('./dummy.server');
    return done();
});


after(function (done) {
    console.log(" STOP")
    server.close();
    return done();
});
