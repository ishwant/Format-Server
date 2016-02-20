module.exports = function(app) {

	// server routes ===========================================================

	var User            = require('./models/user.js');

	//User registration API
	app.post('/signup', function(req, res) { //I

		console.log('User FName: %s',req.body.userFName);
		console.log('User LName: %s',req.body.userLName);
		console.log('User Token: %s',req.body.userToken);

   		var req_fname = req.body.userFName;
   		var req_lname = req.body.userLName;
   		var req_token = req.body.userToken;

   		User.findOne({ token : req_token.toString()},function(err,founduser){
   			console.log('query ran');
   			if(founduser == null){
   				console.log("Error found");
   				res.send({ status : 'FAIL' , message : 'Token not found' });	
   			} else {
   				console.log(founduser.toString());
   				if(founduser.first_name != req_fname || founduser.last_name != req_lname){
   					console.log("Incorrect username");
   					res.send({ status : 'FAIL' , message : 'User Incorrect'});
   				}
   				else{
   					res.send({ status : 'SUCCESS' , message : 'Sign-up'});
   				}				
   			}
   		});
	});
   app.post('/share', function(req, res) { //I

      var entryToPost = {
         shared_date :  new Date(),
         category :  req.body.eventCategory,
         event_name :  req.body.eventName,
         event_notes:   req.body.eventNotes,
         event_timestamp:   req.body.eventTimestamp,
         medicine_amount:  req.body.eventMedicineAmount,
         medicine_type:   req.body.eventMedicineType,
         meal_amount :  req.body.eventMealAmount,
         reading_value :  req.body.eventReadingValue,
         activity_time :  req.body.eventActivityTime
      };
      console.log(entryToPost);


      User.findOneAndUpdate({ token : req.body.UserToken.toString()},
      {
         "$addToSet" : {
               "event_entries" : entryToPost
         }
      },
      function(err) {
         if (err)
         {
            res.send({ status : 'FAIL'});
            console.log("FAIL: %s", err);
         }
         res.json({ status: "SUCCESS"});
      }
      ); // end of findOne query 

   }); // end of post function
}; //Main function closing
