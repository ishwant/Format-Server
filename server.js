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

//require('./config/passport')(passport); // pass passport for configuration

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
require('./app/routes.js')(app); // configure our routes
require('./app/p_routes.js')(app); //patient info related routes
require('./app/c_routes.js')(app); //CaseWorker info related routes

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

