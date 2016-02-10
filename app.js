var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');
var SamlStrategy = require('passport-saml').Strategy;
var cookieSession = require('cookie-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

var config = require('./config/config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('x-powered-by',false); // disable sending powering technology for security reasons

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: {
    maxAge: 2678400000 // 31 days
  },
}));

app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(config.dburl); // connect to our database
//Setup passport
/* app.use(session({
  secret: config.sessionsecret
})); // session secret */
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
passport.use(new SamlStrategy(
  {
    path: '/login/auth/saml/callback',
    entryPoint: 'https://local.cis.strath.ac.uk/simplesamlphp/module.php/core/loginuserpass.php',
    issuer: 'passport-saml'
  },
  function(profile, done) {
    findByEmail(profile.email, function(err, user) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  })
);
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/', routes);
app.use('/users', users);
app.use('/profile', users);
require('./routes/login')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/login')(app, passport); // load our routes and pass in our app and fully configured passport


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
