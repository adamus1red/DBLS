var express = require('express');
var router = express.Router();
var exercise = require('../app/exercise');

/* GET users listing. */
router.get('/:eid', function(req, res, next) {
    
    // exercise.load(); 
    res.render('exercise.ejs', {exID : exercise.load(req.params.eid)});
});

module.exports = router;
