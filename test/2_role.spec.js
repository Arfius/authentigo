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

var User=  require('mongoose').model('users');
var url= "http://localhost:3210/api/v1/"

describe("[Test Registrazione / Login Utenti]", function()
{
    var agent = request.agent(url) ;

    it('AGENT:Login corretto ', function(done)
    {
         var account =
         {
            username: 'user@prova.it',
            password: 'SkQr0#XuW',
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


    /*it('AGENT:Test / ROLE ', function(done)
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
    });*/


});


