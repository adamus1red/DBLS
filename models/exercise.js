var mongoose = require('mongoose');

var exerciseSchema = mongoose.Schema({
    id : {
        type : Number
    },
    question : String,
    answer : String,
    testQuery : String,
    hint : String
});

module.exports = mongoose.model('Exercise', exerciseSchema);