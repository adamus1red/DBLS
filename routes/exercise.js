var express = require('express');
var router = express.Router();
//var exercise = require('../app/exercise');
//var mongoose = require('mongoose');
//var ex = require('../models/exercise');

var util = require('util')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./exercise.db');
var fs = require('fs');
var dir = './tmp';



/* GET exercise listing. */
router.get('/:eid', function(req, res, next) {
    if(req.isAuthenticated()){
        db.get("SELECT * FROM exercise WHERE id = ?", req.params.eid, function(err, row){
            if(err){
                console.err(err);
            } else if (typeof row === 'undefined'){
                res.render('error.ejs', {message: "No such question", error: {status: "QE404",stack: "Yo' no question with that ID exists. Try a different one"}});
            } else {
                res.render('exercise.ejs', {exID: req.params.eid, title: "Exercise " + req.params.eid, question : row.question, output: ""});
            }
            
        });
    } else {
        res.redirect('/login');
    }
});

router.post('/:eid', function(req,res,next){
    console.log(req.body);
    
    if(req.isAuthenticated()){
        db.get("SELECT * FROM exercise WHERE id = ?", req.params.eid, function(err, row){
            if(err){
                console.err(err);
            } else if (typeof row === 'undefined'){
                res.render('error.ejs', {message: "No such question", error: {status: "QE404",stack: "Yo' no question with that ID exists. Try a different one"}});
            } else {
                //console.log();
                var db2 = new sqlite3.Database(saveOut(req, row.testDB));
                db2.get(req.body.sql, function(err, userRow){
                    if(err){
                        res.render('exercise.ejs', {exID: req.params.eid, question : row.question, output: err});
                    } else if (typeof userRow === 'undefined') {
                        res.render('error.ejs', {message: "Something went horribly wrong", error: {status: "QE403",stack: "Something hit the fan and blew everywhere."}});
                    } else {
                        res.render('exercise.ejs', {exID: req.params.eid, title: "Exercise " + req.params.eid, question : row.question, output: userRow});
                    }
                    
                });
                //res.render('exercise.ejs', {exID: req.params.eid, title: "Exercise " + req.params.eid, question : row.question, output: req.body.sql});
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