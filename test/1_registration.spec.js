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

var url= "http://localhost:3210/"
describe("[Test Registrazione / Login Utenti]", function()
{

    //Creo un utente prova
    it('Preparazione DB', function(done)
    {
        var user = new User();
        user.username="user@prova.it"
        user.enabled= true;
        user.save(function(error,success)
        {
            require('mongoose').model('users').remove({username:"alfonso.farruggia@gmail.com"}, function(error,success)
            {
                done();
            });
        })
    });


    it('Login corretto', function(done)
    {
         var account =
         {
            username: 'user@prova.it',
            password: 'HJTQTqb$#',
         };

         request(url)
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


    it('Login errato (errore nella password)', function(done)
    {
        var account =
        {
            username: 'user@prova.it',
            password: 'HJTQTqb$#__',
        };

        request(url)
            .post('login')
            .send(account)
            .end(function(err, res)
            {
                if (err)
                {
                    console.log(err);
                    throw err;
                }
                res.status.should.be.equal(404);
                done();
            });
    });

    it('Registrazione', function(done)
    {
        var account =
        {
            email: 'alfonso.farruggia@gmail.com',
            r_email: 'alfonso.farruggia@gmail.com',
        };

        request(url)
            .post('registration')
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


