// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
        p_id              : { type : String, unique : true, required : true },
        p_first_name      : String,
        p_last_name       : String,
        p_token		  : { type : String},
        p_dob             : Date,
        p_mobile_contact  : String,
        p_email           : String,
        p_address1         : String,
        p_address2         : String,
        p_city            : String,
        p_state           : String,
        p_zipcode         : String,
        p_case_worker     : String,
        p_active          : Boolean,
        p_program         : { type : Array , "default" : [] },
        p_event_entries   : [{

        	shared_date    : Date,
        	
        	category       : String,
        	event_name     : String,
        	event_notes    : String,
        	event_timestamp: String,
                event_details  : { type : Array , "default" : [] },
        	
                medicine_amount: Number,
        	medicine_type  : String,

        	meal_amount    : Number,

        	reading_value  : Number,

        	activity_time  : Number,

        }],
        p_messages        : [{
                m_id              : mongoose.Schema.Types.ObjectId,
                m_share_date      : Date,
                m_message         : String,
        }],
});

// checking if token is valid
userSchema.methods.validToken = function(token) {
	if(token.toLowerCase() == (this.local.token).toLowerCase()){
		return true;
	}
	else{
		return false;
	}
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
