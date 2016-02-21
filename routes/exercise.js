var express = require('express');
var router = express.Router();
//var exercise = require('../app/exercise');
//var mongoose = require('mongoose');
//var ex = require('../models/exercise');

var util = require('util')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./exercise.db');

/* GET exercise listing. */
router.get('/:eid', function(req, res, next) {
    if(req.isAuthenticated()){
        db.get("SELECT * FROM exercise WHERE id = ?", req.params.eid, function(err, row){
            if(err){
                console.err(err);
            } else if (typeof row === 'undefined'){
                res.render('error.ejs', {message: "No such question", error: {status: "QE404",stack: "Yo' no question with that ID exists. Try a different one"}});
            } else {
                res.render('exercise.ejs', {exID: req.params.eid, question : row.question, output: ""});
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
                res.render('exercise.ejs', {exID: req.params.eid, question : row.question, output: req.body.sql});
            }
            
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;