'use strict'; // <-- what does this mean?

/**
 * @ngdoc overview
 * @name budgy
 * @description
 * # envelope system
 *
 * Main module of the application.
 */
 
// wrapping your javascript in closure is a good habit
(function(){

	var app = angular.module('DiabetikApp', 
		['ngAnimate',
		'ngAria',
		'ngCookies',
		'ngMessages',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ui.bootstrap',
		'angularUtils.directives.dirPagination'])

	app.config(function ($routeProvider) {
		$routeProvider
		// maybe login page can be integrated into this html file.
		.when('/', {
			templateUrl: 'modules/core/views/login.html',
			controller: 'LoginCtrl'
		})
		// clicking on home will cause main controller to use this route
		// and will provide the EnvelopesCtrl
		.when('/home', {
			templateUrl: 'Modules/Patients/Views/home.html',
			controller: 'allPatientsCtrl'
		})
		.when('/registerPatient', {
			templateUrl: 'Modules/Patients/Views/registerPatient.html',
			controller: 'singlePatientCtrl'
		})
		.when('/registrationDetails/:p_id', {
			templateUrl: 'Modules/Patients/Views/registrationDetails.html',
			controller: 'singlePatientCtrl'
		})
		.when('/viewPatient/:p_id', {
			templateUrl: 'Modules/Patients/Views/viewPatient.html',
			controller: 'singlePatientCtrl'
		})
		.when('/editPatient/:p_id', {
			templateUrl: 'Modules/Patients/Views/editPatient.html',
			controller: 'singlePatientCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
	})
	
	// specify a controller for setting the budgetId:
	// we could have a login controller set the budgetId & userId 
	// in the rootScope. Something like the controller below
	app.controller('LoginCtrl', ['$rootScope', function($rootScope) {
		$rootScope.budgetId = 1;
	}]);
	
})();
