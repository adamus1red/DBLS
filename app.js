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
var helmet = require('helmet');
var compression = require('compression');
var csrf = require('csurf')

var routes = require('./routes/index');
var users = require('./routes/users');
var staff = require('./routes/staff');
var login = require('./routes/login');
var exerciseRouter = require('./routes/exercise');

var config = require('./config/config');
var csrfProtection = csrf({ cookie: true })

var app = express();

// view engine setup
app.set('env', config.env);
//app.set('env', "production");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('x-powered-by',false); // disable sending powering technology for security reasons

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images','ico','android','web_hi_res_512.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['dsgdahgehtdr', 'hgetrbtdbtdf'],
  cookie: {
    maxAge: 2678400000 // 31 days
  },
}));
app.use(compression({filter: shouldCompress}))
app.use(helmet()) // Bunch of useful CSP, Prefetch, header crap

app.use('/static',express.static(path.join(__dirname, 'public'), { maxAge: 86400000 /* 1d */ }));
app.use('/bower',express.static(path.join(__dirname, 'bower_components'), { maxAge: 86400000 /* 1d */ }));
mongoose.connect(config.dburl); // connect to our database
//Setup passport
/* app.use(session({
  secret: config.sessionsecret
})); // session secret */
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/', routes);
app.use('/users', users);
app.use('/profile', users);
app.use('/staff', staff);
app.use('/exercise', exerciseRouter);
require('./routes/login')(app, passport); // load our routes and pass in our app and fully configured passport
// require('./routes/login')(app, passport); // load our routes and pass in our app and fully configured passport


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
    if(err.status === 500) {
      res.render('500', {
        message: err.message,
        error: err,
        user : req.user
      });
    } else {
      res.render('error', {
        message: err.message,
        error: err,
        user : 0
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if(err.status === 404){
    res.render('404', {user : req.user});
  } else if(err.status === 500) {
    res.render('500', {
      message: err.message,
      error: {},
      user : req.user
    });
  } else {
    res.render('error', {
      message: err.message,
      error: {},
      user : req.user
    });
  }
});

console.log("We done the magic. Now running on port " + (process.env.PORT || '3000'));
module.exports = app;
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}