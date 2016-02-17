var mongoose = require('mongoose');

var exerciseSchema = mongoose.Schema({
    id : String,
    question : String,
    answer : String,
    testQuery : String,
    hint : String
});

module.exports = mongoose.model('Exercise', exerciseSchema);