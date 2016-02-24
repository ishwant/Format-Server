module.exports = function(app) {
	var User            = require('./models/user.js');
	var program            = require('./models/program.js');

	//===============GET ALL PATIENT RECORDS===========================

	app.get('/patients', function(req, res) {

		User.find(function(err, users) {


			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);

			res.json(users); // return all todos in JSON format
		});
	});	

	//================REGISTER NEW PATIENT=============================

	app.post('/registerPatient', function(req, res) {
		var newPatient = new User();

		newPatient.p_id = req.body.p_id;
		newPatient.p_first_name = req.body.p_first_name;
		newPatient.p_last_name = req.body.p_last_name;
		newPatient.p_dob = req.body.p_dob;
		newPatient.p_mobile_contact = req.body.p_mobile_contact;
		newPatient.p_email = req.body.p_email;
		newPatient.p_address1 = req.body.p_address1;
		newPatient.p_address2 = req.body.p_address2;
		newPatient.p_city = req.body.p_city;
		newPatient.p_state = req.body.p_state;
		newPatient.p_zipcode = req.body.p_zipcode;
		newPatient.p_case_worker = req.body.p_case_worker;
		newPatient.p_program = req.body.p_program;
		newPatient.p_active = true;

		var token = generateToken();
		console.log("generated token: %s", token);

		newPatient.p_token = token;
		
		User.findOne({p_id: newPatient.p_id}, function(err,found){
			if(found==null){
				newPatient.save(function(err){
					if(err){
						console.log(err);
						res.send(err);
					}
					res.json({message: 'New Patient Registered'});
				});
			}
		});
	});	

	//================VIEW ONE PATIENT RECORD=========================
	app.get('/viewPatient/:p_id', function(req, res) {
		var patient_id = req.params.p_id;
		User.findOne({p_id: patient_id}, function(err,found){
			if(err){
				console.log('error occured');
				res.send(err);
			}
			if(found==null){
				console.log('No such user exists');
				res.send({status: 'User not found'});
			}
			if(found!=null){
				console.log('viewPatient called, User Found!');
				res.send(found);
			};
		});
	});	

	//================UPDATE PATIENT RECORD=============================

	app.put('/editPatient/:p_id', function(req, res) {
		
		var patient_id = req.params.p_id;
		User.findOne({p_id: patient_id}, function(err,found){
			if(err){
				console.log('error occured');
				res.send(err);
			}
			if(found==null){
				console.log('No such user exists');
				res.send({status: 'User not found'});
			}
			if(found!=null){
				console.log('editPatient called, User Found!');
				found.p_program = [];
				found.p_id = req.body.p_id;
				found.p_first_name = req.body.p_first_name;
				found.p_last_name = req.body.p_last_name;
				found.p_dob = req.body.p_dob;
				found.p_mobile_contact = req.body.p_mobile_contact;
				found.p_email = req.body.p_email;
				found.p_address1 = req.body.p_address1;
				found.p_address2 = req.body.p_address2;
				found.p_city = req.body.p_city;
				found.p_state = req.body.p_state;
				found.p_zipcode = req.body.p_zipcode;
				found.p_case_worker = req.body.p_case_worker;
				found.p_program = req.body.p_program;
				console.log(found.p_program);
				found.p_active = req.body.p_status;
				found.p_token = req.body.p_token;
				found.save(function(err) {
		
					if (err)
					{
						res.send(err);
					}
					res.json({message: "Patient updated"});
				});
			};
		});
	});	

	//================DEACTIVATE PATIENT PROFILE=============================

	app.put('/togglePatientStatus/:p_id', function(req, res) {
		
		var patient_id = req.params.p_id;
		User.findOne({p_id: patient_id}, function(err,found){
			if(err){
				console.log('error occured');
				res.send(err);
			}
			if(found!=null){
				console.log('deactivatePatient called, User Found!');
				if(found.p_active==true){
					found.p_active = false;
				} else{
					found.p_active = true;
				}
				found.save(function(err) {
		
					if (err)
					{
						res.send(err);
					}
					res.json({message: "Patient profile status changed"});
				});
			};
		});
	});	


	//================CHECK UNIQUE PATIENT ID=========================

	app.get('/uniqueIdCheck/:test_id', function(req, res) {
		//console.log(req.params);
		var p_idtoTest = req.params.test_id;
		console.log(p_idtoTest);
		User.findOne({p_id: p_idtoTest}, function(err,found){
			if(err){
				console.log('p_id Exists');
				res.send({valid_id:false});
			}
			if(found==null){
				console.log('No such p_id exists');
				res.send({valid_id:true});
			} else{
				console.log('p_id Exists');
				res.send({valid_id:false});
			};
			
		});
	});	

	//================DELETE A MESSAGE=============================

	app.delete('/deleteMessage/:p_id/:m_id', function(req, res) {
		
		var patient_id = req.params.p_id;
		var message_id = req.params.m_id;

		console.log("p_id: %s", patient_id);
		console.log("m_id: %s", message_id);

		User.findOneAndUpdate({p_id: patient_id},{$pull:{p_messages: {m_id:message_id}}}, function(err) {
		
			if (err)
			{ 
				console.log(err);
				res.send(err);
			}

			res.json({ message: 'message deleted' });
		});
	});	


	//============FUNCTION TO GENERATE TOKEN==========================
    var generateToken = function (){
        console.log('generateToken called');
        var tokenLenth = 5;

        var characters = ['a', 'b', 'c', 'g',  'l', 'o', 't'];
        var numbers = ['2','3'];

        var finalCharacters = characters;
        finalCharacters = finalCharacters.concat(numbers);


        var tokenArray = [];
        for (var i = 0; i < tokenLenth; i++) {
            tokenArray.push(finalCharacters[Math.floor(Math.random() * finalCharacters.length)]);
        };
        var token = tokenArray.join("");
        console.log('token in generateToken %s', token);
        return token;   
    };

    //////////////////////////////////////////////////////////////////

    //=============HANDLING PROGRAMS================================

    //GET ALL PROGRAMS
    app.get('/programs', function(req, res) {

		program.find(function(err, prgm) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(prgm); // return all todos in JSON format
		});
	});	

    //ADD NEW PROGRAM
    app.post('/programs', function(req, res) {
		var newProgram = new program();

		newProgram.programName = req.body.programName;
		newProgram.programAlias = req.body.programAlias;
		
		program.findOne({programName: newProgram.programName}, function(err,found){
			if(found==null){
				newProgram.save(function(err){
					if(err){
						console.log(err);
						res.send(err);
					}
					res.json({message: 'New Program Saved'});
				});
			}
		});
	});	

};