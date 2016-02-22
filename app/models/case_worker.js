// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var case_worker_Schema = mongoose.Schema({
        c_id              : { type : String, unique : true, required : true },
        c_first_name      : String,
        c_last_name       : String,
        c_token		  : { type : String},
        c_mobile_contact  : String,
        c_email           : String,
        c_active          : Boolean,
});

module.exports = mongoose.model('caseWorkers', case_worker_Schema);