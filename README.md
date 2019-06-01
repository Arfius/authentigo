# AuthentiGo
**AuthentiGo** is a javascript package that implements the procedure for registration, authentication and role-manager for a Nodejs web app. **AuthentiGo** wraps several packages and it is based on the web application framework [**express**](https://expressjs.com) and [**MongoDB**](http://www.mongodb.com). [**Passport-js**](http://www.passportjs.org) is used as authentication manager with **LocalStrategy**, wherease, as email manager, [**node-mailer**](http://www.nodemailer.com) is used. **AuthentiGo** uses [**Express-restify-mongoose**](https://florianholzapfel.github.io/express-restify-mongoose/) to manage the User model.

**AuthentiGo** accepts a email address of the user to start the registration procedure. After receiving the email, **AuthentiGo** creates a disabled account and send back the confirmation link via email for enabling. 

After account confirmation, the account credential will be send to the user. In case of the password has been forgotten, AuthentiGo send a new one via email, if the account is not confirmed, the 'confirmation link' will be re-send.

Using **AuthentiGo**, you have an all-in-one mechanism for: **Registration and mail confirmation**, **Login**, **Password recovery**, **Logout**, **Role Manager**


## Installation

```sh
npm install https://github.com/Arfius/authentigo.git --save
```

## Get Started
AuthentiGo needs the a config json object for working fine. The object is composed of three sub-objects: **mailer** , **url** and **page**. **mailer**  is useful for configuring the the **node-mailer** package, in fact, the mail server paramters are requested. **url** includes params related to your webapp and they need to configure the ReST endpoints and to generate the confimation link during the registration procedure.  **page** keeps the urls for user redirect after confirmation link.

After creating the configuration json object, AuthentiGo is imported using 'require' `var authentigo=require('authentigo')`, before using the package, it is necessary applying the configuration object by invoking `authentigo.settings(authsetting)`, then it is the time to use the package passing the express-app and the router `authentigo.init(app,router)` of your webapp. User accounts are stored in stand-alone mongodb database named `authentigo`.


```js
...
var app = express()
var router = express.Router()
...

var authsetting = {
  "mailer":
  {
    "host": "mail.domain.it",
    "port": 587,
    "auth": {
      "user": "domain.it",
      "pass": "passForDomain"
    },
    "tls": {
      "rejectUnauthorized": false
    }
  },
  "url":
  {
    "url":"http://localhost",
    "port":3210,
    "url_prefix":"/api/v1"
  },
  "page":
  {
    "success_page":"http://localhost:3210/success_page",
    "failure_page":"http://www.failure.ocm/page"
  }
}

//1 . Import the authentigo package.
var authentigo=require('authentigo');

//2 . Apply the settings to the package.
authentigo.settings(authsetting);

//3 . Pass the express app, the router and an array of mongoose schema to authentigo.
authentigo.init(express,router)
```
## Role Manager
How work the role manager

## Use Check Permission external to library
Use  req.authentigo_external="true";


## ReST endpoints 
### [/url_prefix]/login
* **Method** : POST
* **Request Params** : `{username:"email@domain.it" , password:"mysecret1234"}` 
* **Server Response** : 
	* **Success** : Status:200 , `[user Object]`
	* **Failure** : Status:401 , `{mess:"Unauthorized"}`
	* **Error** : Status:500 , `{mess:"Internal Server Error"}`

### [/url_prefix]/registration
* **Method** : POST
* **Request Params** : `{email:"email@domain.it" , r_email:"email@domain.it"}` 
* **Server Response** : 
	* **Success** : Status:200 , `{mess:"OK"}`
	* **Failure** : Status:400 , `{mess:"Bad Request"}`
	* **Error** : Status:500 , `{mess:"Internal Server Error"}`

### [/url_prefix]/logout
* **Method** : GET
* **Server Response** : 
	* **Success** : Status:200 , `{mess:"OK"}`
	* **Error** : Status:500 , `{mess:"Internal Server Error"}`

### [/url_prefix]/check
* **Method** : GET
* **Server Response** : 
	* **Success** : Status:200 , `{mess:"OK"}`
	* **Failure** : Status:401 , `{mess:"Unauthorized"}`

### [/url_prefix]/confirm/:id
* **Method** : GET
* **Request Params** : `{id:"0123useridzxcv"}` 
* **Server Response** : 
	* **Success** : Redirect to `success_page`
	* **Failure** : Redirect to `failure_page`
	* **Error** : Status:500 , `{mess:"Internal Server Error"}`

### [/url_prefix]/forgot
* **Method** : GET
* **Request Params** : `{username:"email@domain.it"}` 
* **Server Response** : 
	* **Success** : Status:200 , `{mess:"OK"}`
	* **Failure** : Status:400 , `{mess:"Bad Request"}`
	* **Error** : Status:500 , `{mess:"Internal Server Error"}`


## Example

```sh
node test/dummy.server.js
```
## Test
```sh
npm test
```
- [X] Login
- [X] Login with Error
- [X] User Registration
- [X] User Confirm
- [X] Role
- [X] Update Password
- [X] Externale Check Permission

 
