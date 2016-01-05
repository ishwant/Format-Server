// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
        first_name     : String,
        last_name     : String,
        token		: String
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
