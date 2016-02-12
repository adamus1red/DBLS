var express = require('express');
var mongoose = require('mongoose');
var ex = require('../model/exercise');

module.exports = function(app, passport) {
    
    loadQuestion = function (eid){
        ex.findOne({'exercise.ID' : eid}, 'question hint', function (err, exercise) {
        if (err) return handleError(err);
            console.log('%s', exercise.question,);
            return exercise.question;
        }));
    }
    
    
};
