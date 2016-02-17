var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.user){
        console.log(req.user);
        res.render('profile.ejs', {title: "Profile", user : req.user});
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