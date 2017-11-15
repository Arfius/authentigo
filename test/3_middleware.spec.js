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
var account_creato;

describe("[Test Registrazione / Login Utenti]", function()
{



    it('AGENT:Login  ', function(done)
    {
         var account =
         {
            username: 'user@prova.it',
            password: 'BytLl5Oyf',
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
             account_creato=res.body;
             res.status.should.be.equal(200);
             done();
         });
     });

});

describe("[Test Middleware]", function()
{

    it('AGENT:Cambio Password', function(done)
    {
            var account =
            {
                password: 'password',
            };

             agent
            .patch('users/'+account_creato._id)
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


