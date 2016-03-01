var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./exercise.db', sqlite3.OPEN_READWRITE);

/* GET users listing. */
router.get('/', loggedIn, isAdmin, function(req, res, next) {
    if(req.user){
        var hash = "00000000000000000000000000000000";
        if(req.user.local.email){
            hash = crypto.createHash('md5').update(req.user.local.email).digest("hex");
        } else if (req.user.google.email) {
            hash = crypto.createHash('md5').update(req.user.google.email).digest("hex");
        }
        db.all("SELECT * FROM exercise", req.params.eid, function(err, row){
            if(err) {
                console.err(err);
            }
            console.log(req.user);
            console.log(row)
            res.render('profile.ejs', {title: "Profile", user : req.user, userAvatarHash: hash, questions: row});
        });
    } else {
        res.redirect('/login');
    }
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
    if (req.user.isAdmin == "True") {
        next();
    } else {
        res.redirect('/profile');
    }
}