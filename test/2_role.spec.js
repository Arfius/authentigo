/**
 * Created by alfonso on 27/04/17.
 */
/**
 * Created by alfonso on 14/02/17.
 */
var   chai = require('chai')
    , sinon = require('sinon')
    , should = require('should')
    , request = require('supertest');

      require('../class/user');

var mongoose = require('../mongoose/mongoconfig').aut_mongoose
var User=  mongoose.model('users');

var url= "http://localhost:3210/api/v1/"
var agent = request.agent(url) ;

describe("[Test Registrazione / Login Utenti]", function()
{


    it('AGENT:Login corretto ', function(done)
    {
         var account =
         {
            username: 'user@prova.it',
            password: 'HkXTdqj6b',
         };

         agent
         .post('login')
         .send(account)
         .end(function(err, res)
         {
             if (err)
             {
                console.log(err);
                throw err;
             }
             res.status.should.be.equal(200);
             done();
         });
     });

});

describe("[Test / ROLE]", function()
{

    it('AGENT:Test / ROLE URL ALLOWED', function(done)
    {
            agent
            .get('members')
            .end(function(err, res)
            {

                if (err)
                {
                    console.log(err);
                    throw err;
                }

                res.status.should.be.equal(200);
                done();
            });
    });

    it('AGENT:Test / ROLE URL NOT ALLOWED', function(done)
    {
        agent
            .post('members')
            .end(function(err, res)
            {

                if (err)
                {
                    console.log(err);
                    throw err;
                }

                res.status.should.be.equal(400);
                done();
            });
    });


});


