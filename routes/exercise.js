var express = require('express');
var router = express.Router();
//var exercise = require('../app/exercise');
//var mongoose = require('mongoose');
//var ex = require('../models/exercise');

var util = require('util')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./exercise.db', sqlite3.OPEN_READWRITE);
var fs = require('fs');
var dir = './tmp';



/* GET exercise listing. */
router.get('/:eid', function(req, res, next) {
    if(req.isAuthenticated()){
        db.get("SELECT * FROM exercise WHERE id = ?", req.params.eid, function(err, row){
            if(err){
                console.error(err);
            } else if (typeof row === 'undefined'){
                res.render('error.ejs', {message: "No such question", error: {status: "QE404",stack: "Yo' no question with that ID exists. Try a different one"}, user : req.user});
            } else {
                res.render('exercise.ejs', {exID: req.params.eid, title: "Exercise " + req.params.eid, question : row.question, output: "", user : req.user, answerState : 1});
            }
            
        });
    } else {
        res.redirect('/login');
    }
});

router.post('/:eid', function(req,res,next){
    console.log(req.body);
    var subSQL = req.body.sql.replace(/(\r\n|\n|\r)/gm,"");;
    if(req.isAuthenticated()){
        db.get("SELECT * FROM exercise WHERE id = ?", req.params.eid, function(err, row){
            if(err){
                console.error(err);
            } else if (typeof row === 'undefined'){
                res.render('error.ejs', {message: "No such question", error: {status: "QE404",stack: "Yo' no question with that ID exists. Try a different one", user : req.user}});
            } else {
                //console.log();
                var testDBFile = saveOut(req, row.testDB);
                var db2 = new sqlite3.Database(testDBFile);
                db2.all(subSQL, function(err, userRow){
                    if(err){
                        res.render('exercise.ejs', {exID: req.params.eid, title: "Exercise " + req.params.eid, question : row.question, output: JSON.stringify(err, null, 4), user : req.user, sentValue: req.body.sql, answerState : 3});
                    } else if (typeof userRow === 'undefined') {
                        res.render('error.ejs', {message: "Something went horribly wrong", error: {status: "QE403",stack: "Something hit the fan and blew everywhere.", user : req.user}});
                    } else {
                        db2.all(row.testQuery, function(err, correctRow) {
                            if(err) {
                                res.render('exercise.ejs', {exID: req.params.eid, title: "Exercise " + req.params.eid, question : row.question, output: JSON.stringify(err, null, 4), user : req.user, sentValue: req.body.sql, answerState : 3});
                            }
                            var userAnswer = JSON.stringify(userRow), correctAnswer = JSON.stringify(correctRow);
                            if(userAnswer === correctAnswer) {
                                db.get('SELECT userID, exID FROM "main"."answers" WHERE userID = ?1 AND exID = ?2', {1: req.user.id, 2: req.params.eid}, function(err, acheck) {
                                    if(err) {
                                        console.error(err);
                                    }
                                    if(typeof acheck === "undefined") {
                                        db.run('INSERT INTO answers ("userID","exID","answer") VALUES (?1,?2,?3)', {1: req.user.id, 2: req.params.eid, 3: req.body.sql}); 
                                        console.log(req.user.id + " has passed Exercise " + req.params.eid);
                                    }
                                });
                                res.render('exercise.ejs', {exID: req.params.eid, title: "Exercise " + req.params.eid, question : row.question, output: JSON.stringify(userRow, null, 4), user : req.user, sentValue: req.body.sql, answerState : 2});
                            } else {
                                res.render('exercise.ejs', {exID: req.params.eid, title: "Exercise " + req.params.eid, question : row.question, output: JSON.stringify(userRow, null, 4), user : req.user, sentValue: req.body.sql, answerState : 1});
                            }
                        });
                        //res.render('exercise.ejs', {exID: req.params.eid, title: "Exercise " + req.params.eid, question : row.question, output: JSON.stringify(userRow, null, 4), user : req.user, sentValue: req.body.sql});
                    }
                });
                fs.unlink(testDBFile);
            }
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;

function saveOut(req, data) {

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFile(dir + "/"+ req.user._id + req.params.eid + ".db", data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved! " +  dir + "/"+ req.user._id + req.params.eid + ".db"  );
    }); 
    return dir + "/"+ req.user._id + req.params.eid + ".db";
}

function typeOne(req, res, next, row){
    
}