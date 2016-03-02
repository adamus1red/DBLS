var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./exercise.db', sqlite3.OPEN_READWRITE);

/* GET users listing. */
router.get('/', loggedIn, function(req, res, next) {
    var hash = "00000000000000000000000000000000";
    if (req.user.google.email) {
        hash = crypto.createHash('md5').update(req.user.google.email).digest("hex");
    } else if(req.user.local.email){
        hash = crypto.createHash('md5').update(req.user.local.email).digest("hex");
    }
    console.log(req.user)
    db.all("SELECT id FROM exercise", function(err, row){
        if(err) {
            console.error(err);
            res.render('error.ejs', {message: "SQLITE DB error", error: {status: "DB01",stack: err,user : req.user}});
        }
        db.all("SELECT exID FROM answers WHERE userID = ?", req.user.id, function(err, rr) {
            if (err) {
                console.error(err);
                res.render('error.ejs', {message: "SQLITE DB error", error: {status: "DB02",stack: err,user : req.user}});
            }
            if(rr == "") {
                res.render('profile.ejs', {title: "Profile", user : req.user, userAvatarHash: hash, questions: row, qdone: {exID:0}});
            } else {
                res.render('profile.ejs', {title: "Profile", user : req.user, userAvatarHash: hash, questions: row, qdone: rr});
            }
        })
        
    });
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

function renderData(req, res, next){
    
}