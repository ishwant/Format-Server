// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'Diabetik-Backend' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
//require('./app/routes_passport.js')(app, passport); // load our routes and pass in our app and fully configured passport
//require('./app/routes.js')(app); // configure our routes




console.log('TESTING');
//JUST THE LOGIN PART : DONT FORGET TO MOVE IT LATER

var User            = require('./app/models/user.js');
app.post('/signup', function(req, res) { //I
	console.log('calling me');
	console.log(req.body.userFName);
	console.log(req.body.userLName);
	console.log(req.body.userToken);


   var req_fname = req.body.userFName;
   var req_lname = req.body.userLName;
   var req_token = req.body.userToken;

   User.find({ token : req_token.toString()},function(err,founduser){
   		console.log('query ran');
   		console.log(founduser.toString());
   		if(founduser.length <=0){
   			console.log("Error found");
   			res.send({ status : 'FAIL' , message : err });	
   		} else {
   			res.send(founduser);				
   		}
   });
});

// launch ======================================================================
app.listen(port);
 


console.log('The magic happens on port ' + port);