var express = require('express');
var router = express.Router();
var passport = require('passport');

module.exports = function(app, passport) {
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login/', function(req, res) {
            res.render('login.ejs', { title: "Login", message: req.flash('loginMessage') });
        });

        
        // process the login form
        app.post('/login/', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/login/signup', function(req, res) {
            res.render('signup.ejs', { title: "Signup", message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/login/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/login/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/login/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/login/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/login/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/login/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/login/'
            }));

    // SAML ---------------------------------

        // send to CIS SAML to do the authentication
        app.get('/login/auth/saml',
            passport.authenticate('saml', { failureRedirect: '/login/', failureFlash: true }),
            function(req, res) {
                res.redirect('/login/');
            }
        );

        // the callback after google has authenticated the user
        app.post('/login/auth/saml/callback',
            passport.authenticate('saml', { failureRedirect: '/login/', failureFlash: true }),
            function(req, res) {
                res.redirect('/login/');
            }
        );

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/login/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/login/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/login/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/login/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/login/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/login/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/login/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/login/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/login/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/login/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/login/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
//module.exports = router;
