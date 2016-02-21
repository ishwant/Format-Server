module.exports = function(app) {
	var caseWorker            = require('./models/case_worker.js');

	//===============GET ALL caseWorker RECORDS===========================

	app.get('/CaseWorkers', function(req, res) {

		caseWorker.find(function(err, caseWorkers) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(caseWorkers); // return all todos in JSON format
		});
	});	

	//================REGISTER NEW caseWorker=============================

	app.post('/registerCaseWorker', function(req, res) {
		var newcaseWorker = new caseWorker();

		newcaseWorker.c_id = req.body.c_id;
		newcaseWorker.c_first_name = req.body.c_first_name;
		newcaseWorker.c_last_name = req.body.c_last_name;
		newcaseWorker.c_mobile_contact = req.body.c_mobile_contact;
		newcaseWorker.c_email = req.body.c_email;
		newcaseWorker.c_active = true;

		var token = generateToken();
		console.log("generated token: %s", token);

		newcaseWorker.c_token = token;
		
		caseWorker.findOne({c_id: newcaseWorker.c_id}, function(err,found){
			if(found==null){
				newcaseWorker.save(function(err){
					if(err){
						console.log(err);
						res.send(err);
					}
					res.json({message: 'New caseWorker Registered'});
				});
			}
		});
	});	

	//================VIEW ONE caseWorker RECORD=========================
	app.get('/viewCaseWorker/:c_id', function(req, res) {
		var caseWorker_id = req.params.c_id;
		caseWorker.findOne({c_id: caseWorker_id}, function(err,found){
			if(err){
				console.log('error occured');
				res.send(err);
			}
			if(found==null){
				console.log('No such caseWorker exists');
				res.send({status: 'caseWorker not found'});
			}
			if(found!=null){
				console.log('viewcaseWorker called, caseWorker Found!');
				res.send(found);
			};
		});
	});	

	//================UPDATE caseWorker RECORD=============================

	app.put('/editCaseWorker/:c_id', function(req, res) {
		
		var caseWorker_id = req.params.c_id;
		caseWorker.findOne({c_id: caseWorker_id}, function(err,found){
			if(err){
				console.log('error occured');
				res.send(err);
			}
			if(found==null){
				console.log('No such caseWorker exists');
				res.send({status: 'caseWorker not found'});
			}
			if(found!=null){
				console.log('editcaseWorker called, caseWorker Found!');
				found.c_id = req.body.c_id;
				found.c_first_name = req.body.c_first_name;
				found.c_last_name = req.body.c_last_name;
				found.c_mobile_contact = req.body.c_mobile_contact;
				found.c_email = req.body.c_email;
				found.c_active = req.body.c_status;
				found.c_token = req.body.c_token;
				found.save(function(err) {
		
					if (err)
					{
						res.send(err);
					}
					res.json({message: "caseWorker updated"});
				});
			};
		});
	});	

	//================DEACTIVATE caseWorker PROFILE=============================

	app.put('/toggleCaseWorkerStatus/:c_id', function(req, res) {
		
		var caseWorker_id = req.params.c_id;
		caseWorker.findOne({c_id: caseWorker_id}, function(err,found){
			if(err){
				console.log('error occured');
				res.send(err);
			}
			if(found!=null){
				console.log('deactivatecaseWorker called, caseWorker Found!');
				if(found.c_active==true){
					found.c_active = false;
				} else{
					found.c_active = true;
				}
				found.save(function(err) {
		
					if (err)
					{
						res.send(err);
					}
					res.json({message: "caseWorker profile status changed"});
				});
			};
		});
	});	


	//================CHECK UNIQUE caseWorker ID=========================

	app.get('/caseWorkerUniqueIdCheck/:test_id', function(req, res) {
		//console.log(req.params);
		var c_idtoTest = req.params.test_id;
		console.log(c_idtoTest);
		caseWorker.findOne({c_id: c_idtoTest}, function(err,found){
			if(err){
				console.log('c_id Exists');
				res.send({valid_id:false});
			}
			if(found==null){
				console.log('No such c_id exists');
				res.send({valid_id:true});
			} else{
				console.log('c_id Exists');
				res.send({valid_id:false});
			};
			
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

};