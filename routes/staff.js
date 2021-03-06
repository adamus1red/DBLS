var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var multer  = require('multer')
var upload = multer({ dest: 'tmp/' });
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var db = new sqlite3.cached.Database('./exercise.db', sqlite3.OPEN_READWRITE);
/* GET users listing. */

router.get('/', loggedIn, isAdmin, function(req, res, next) {
    var hash = "00000000000000000000000000000000";
    if (req.user.google.email) {
        hash = crypto.createHash('md5').update(req.user.google.email).digest("hex");
    } else if(req.user.local.email){
        hash = crypto.createHash('md5').update(req.user.local.email).digest("hex");
    }
    totalCalcs(req,res,function(totals){
        res.render('staff.ejs', {title: "Staff Overview", user: req.user, userAvatarHash:hash, data:totals, debugInfo: JSON.stringify(totals,null,4) });
    });
});

router.get('/ex/:eid', loggedIn, isAdmin, function(req, res, next) {
    exInfo(req,res,function(totals){
        res.render('staff-exinfo.ejs', {title: "Exercise Info :: Staff", user: req.user, data:totals, body: JSON.stringify(totals,null,4)});
    });
});

router.get('/add', loggedIn, isAdmin, function(req,res,next) {
   res.render('staff-ex-add.ejs', {title: "Staff Overview", user: req.user, swal:false, message: "", type: 0});
});

var cpUpload = upload.fields([{ name: 'testDB', maxCount: 1 }])
router.post('/add', loggedIn, isAdmin, cpUpload, function(req,res,next) {
    console.log(req.body);
    console.log(req.files);
    var data = fs.readFileSync(req.files.testDB[0].path);
    db.run('INSERT INTO exercise ("question","answer","testQuery","hint","testDB","type") VALUES ($question,$answer,$testQuery,$hint,$testDB,0)',{$question : req.body.Question,$answer : req.body.Answer,$testQuery : req.body.test_query,$hint : req.body.test_query,$testDB : data}, function(err) {
        if(err) {
            res.render('staff-ex-add.ejs', {title: "Add Exercise :: Staff", user: req.user, debugInfo: JSON.stringify(req.body) + "\r\nFILE" + JSON.stringify(req.files), error: "true", message: "SQL Error", type: 1});
        } else {
            res.render('staff-ex-add.ejs', {title: "Add Exercise :: Staff", user: req.user, debugInfo: JSON.stringify(req.body) + "\r\nFILE" + JSON.stringify(req.files), message: "Added Exercise", type: 2});
        }
        
    });   
    fs.unlink(req.files.testDB[0].path);
        
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

function totalCalcs(req, res, next) {
    var totals = {};
    db.all("SELECT * FROM exercise", function(err, row){
        if(err){
            console.error(err);
            res.render('error.ejs', {message: "SQLITE DB error", error: {status: "SP01",stack: err,user : req.user}});
        } else {
        totals.exercises = row;
        
            db.all("SELECT * FROM answers", function(err, row) {
                if(err){
                    console.error(err);
                    res.render('error.ejs', {message: "SQLITE DB error", error: {status: "SP02",stack: err,user : req.user}});
                } else {
                    totals.answers = row;
                    next(totals);
                }
            });
        }
    });
}

function exInfo(req, res, next) {
    var data = {};
    db.get("SELECT * FROM exercise WHERE id = ?", req.params.eid , function(err, row){
        if(err){
            console.error(err);
            res.render('error.ejs', {message: "SQLITE DB error", error: {status: "SP01",stack: err,user : req.user}});
        } else {
        data.exercises = row;
        db.all('SELECT * FROM "answers" WHERE exID = ?2', {2: req.params.eid}, function(err, acheck) {
            if(err){
                console.error(err);
                res.render('error.ejs', {message: "SQLITE DB error", error: {status: "SP02",stack: err,user : req.user}});
            } else {
                data.answers = acheck;
                next(data);
            }
        });
        }
    });
}