// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var program_Schema = mongoose.Schema({
        programName      : String,
        programAlias     : String
});

module.exports = mongoose.model('program', program_Schema);
