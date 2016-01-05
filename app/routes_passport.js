// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // SIGNUP ==============================
    // =====================================

    // process the signup form
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send(401,{ success : false, message : 'authentication failed' });
    }
    req.login(user, function(err){
      if(err){
        return next(err);
      }
      return res.send({ success : true, message : 'authentication succeeded' });        
    });
  })(req, res, next);
});

 /*   app.post('/login', function (req, res) {
          passport.authenticate('local', function (err, user) {
               var response = {
                                status: String,
                                message: String
                            }; 
                if (err) {
                    response.status = err;
                    response.message = err.message; 
                    return res.send(response); 
                }
               else{
                    if(user==false){
                      console.log('bad');
                      return res.send({'status':'fail','message':'user exists'});
                    }
                    else{
                        console.log('good');
                        return res.send({'status':'success'});   
                    }   
                };
    });
});
  /*  app.post('/signup', passport.authenticate('signup'), 
                        function(req,res) {
                            var response = {
                                result: 'success',
                                message: 'Signed Up!'
                            };
                            console.log('passport auth sending response');
                            res.send(response);
                        }
            ); */
};


/*// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // SIGNUP ==============================
    // =====================================

    // process the signup form
    app.post('/signup', passport.authenticate('signup', {
        successFlash: 'successful',
    //    successRedirect : '/profile', // redirect to the secure profile section
    //    failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }, function(req,res) {
        console.log('passport auth');
        res.send("success");
    }));
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
} */ 