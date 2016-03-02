var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./exercise.db', sqlite3.OPEN_READWRITE);

/* GET users listing. */
router.get('/', loggedIn, isAdmin, function(req, res, next) {
    res.send("Hello World");
});

module.exports = router;
// route middleware to ensure user is logged in
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

function isAdmin(req, res, next) {
    if (req.user.isAdmin === true) {
        next();
    } else {
        res.redirect('/profile');
    }
}