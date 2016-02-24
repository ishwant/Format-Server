'use strict';

/**
 * @ngdoc overview
 * @name Diabetik App
 * @description
 * # Patient System
 *
 * Main module of the application.
 */
(function(){

    var app = angular.module('DiabetikApp');

    //====================CONTROLLER FOR PATIENT RECORD PAGE===============
    app.controller('allPatientsCtrl', [
        '$scope', 
        '$http', 
        function($scope, $http) {

            $scope.getAllPatients = function() {

                var url = '/patients/';
                console.log('hello');
                
                $http.get(url).success(function(data) {
                    console.log(data);

                    $scope.users = data;
                });
            };  
            $scope.sort = function(keyname){
                $scope.sortKey = keyname;   //set the sortKey to the param passed
                $scope.reverse = !$scope.reverse; //if true make it false and vice versa
            };
        }
    ]);

    //======CONTROLLER FOR REGISTER PATIENT PAGE=========

    //DIRECTIVE to validate unique patient id's
    app.directive('idValidator', function($http, $q) {

    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.id = function(test_id) {
                console.log('modelValue %s', test_id);
                var url = '/uniqueIdCheck/' + test_id;
                console.log('url %s', url);
                return $http.get(url).then(
                    function(response) {
                        if (!response.data.valid_id) {
                            return $q.reject(response.data.errorMessage);
                        }
                        return true;
                    }
                );
            };
        }
    };

    });


    //CONTROLLER
    app.controller('singlePatientCtrl',[
        '$scope',
        '$rootScope', 
        '$http',
        '$location', 
        '$routeParams',
        function ($scope, $rootScope, $http, $location, $routeParams) {

            $scope.sort = function(keyname){
                $scope.sortKey = keyname;   //set the sortKey to the param passed
                $scope.reverse = !$scope.reverse; //if true make it false and vice versa
            };
        
            //=======REGISTER A PATIENT===================
            $scope.addPatient = function(patient,isValid){
                var url = '/registerPatient/';
                console.log(isValid);

                if(isValid){
                    console.log(patient);
                    $http.post(url, patient).success(function(response, status, headers, config){
                        console.log('success');
                        if(response.message=='New Patient Registered'){
                            console.log('rootScope patient assigned');
                            $rootScope.p_id = patient.p_id;
                            var p_id = patient.p_id;
                            var newPath = '/registrationDetails/'+ p_id;
                            $location.path(newPath);
                        }
                    }).error(function(response, status, headers, config){
                        $scope.error_message = response.error_message;
                    });
                }
            };

            $scope.getUrlParamtoViewPatient = function(){

                $rootScope.p_id = $routeParams.p_id;
                console.log('function ran and rootscope p_id is: %s',$rootScope.p_id);
            };

            //============VIEW A PATIENT=====================
            $scope.viewRegisteredPatient = function(){

                var url = '/viewPatient/'+ $rootScope.p_id;
                $http.get(url).success(function(data) {
                    console.log(data);

                    $scope.patient = data;
                    if(data.p_active==true){
                        $scope.patient.p_status = 'Active';
                    } else{
                        $scope.patient.p_status = 'De-active';
                    }
                    $scope.patient = data;
                    $scope.patient.p_dob = new Date(data.p_dob);

                });
            };
            $scope.viewPatient = function(patient){
                
                console.log('object to view: %s', patient.p_token);
                $rootScope.p_id = patient.p_id;
                var url = '/viewPatient/'+ patient.p_id;
                $location.path(url);
                console.log('location changed');
            };

            //============EDIT A PATIENT=======================
            $scope.editPatientRoute = function(patient){

                console.log('EDIT PATIENT ROUTE PARAM OBJECT NAME %s', patient.p_first_name);
                var url = '/editPatient/'+ patient.p_id;
                $location.path(url);
                console.log('edit location changed');
            };
            $scope.getUrlParamtoEditPatient = function(){

                $rootScope.p_id = $routeParams.p_id;
                console.log('EditPatient function ran and rootscope id is: %s',$rootScope.p_id);
            };
            $scope.editPatient = function(patient, isValid){

                var url = '/editPatient/'+patient.p_id;
                console.log('editPatient function called');
                console.log(patient);
                console.log(isValid);
                console.log(patient.p_program);

                if(isValid){
                    console.log(patient);
                    $http.put(url, patient).success(function(response, status, headers, config){
                        console.log('success');
                        if(response.message=='Patient updated'){
                            $scope.alert = {   
                                msg:  'Patient profile updated successfully!!' 
                            };
                            alert("Patient profile updated");
                            var url2='/viewPatient/'+patient.p_id;
                            $location.path(url2);
                        }
                    }).error(function(response, status, headers, config){
                        $scope.error_message = response.error_message;
                    });
                }
            };

            $scope.generateToken = function (){
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
                $scope.patient.p_token = token;
                console.log('token in generateToken %s', token);
                return token;   
            };
            //============DEACTIVATE A PATIENT=======================
            $scope.togglePatientStatus = function(patient){
                var url = '/togglePatientStatus/'+patient.p_id;
                console.log('deactivatePatient called');

                $http.put(url).success(function(response, status, headers, config){
                        console.log('success');
                        if(response.message=='Patient profile status changed'){
                            if(patient.p_status=='Active'){
                                alert("Patient profile Deactivated!");
                            }
                            else{
                                alert("Patient profile Activated!");
                            }                               
                            var url2='/home';
                            $location.path(url2);
                        }
                    }).error(function(response, status, headers, config){
                        $scope.error_message = response.error_message;
                    });
            };

            //=============VIEW MESSAGES=============================
            $scope.viewPatientMessages = function(patient){
                
            //    console.log('object to view messages: %s', patient.p_token);
                $rootScope.p_id = patient.p_id;
                $rootScope.patient = patient;
                var url = '/viewPatientMessages/'+ patient.p_id;
                $location.path(url);
                console.log('location changed');
            };
            $scope.viewlistofPatientMessages = function(){

                var url = '/viewPatient/'+ $rootScope.p_id;
                $http.get(url).success(function(data) {
                    console.log(data);
                    $scope.p_messages = data.p_messages;
                    $scope.p_first_name = data.p_first_name;
                    $scope.p_last_name = data.p_last_name;
                    $scope.p_dob = data.p_dob;
                    $scope.p_program = data.p_program; 
                    console.log($scope.p_messages);
                });
            };
            $scope.deleteMessage = function(message){

                var url = '/deleteMessage/'+ $rootScope.p_id + '/' + message.m_id;
                console.log(url);
                $http.delete(url).success(function(response, status, headers, config){
                    console.log(response.message);
                //    window.location.reload();
                    $scope.viewlistofPatientMessages();
                }).error(function(response, status, headers, config){
                    $scope.error_message = response.error_message; 
                    console.log(response.error_message);     
                });
            };

            //============VIEW MESSAGES=============================
            $scope.viewPatientReport = function(patient){
                $rootScope.p_id = patient.p_id;
                $rootScope.patient = patient;
                var url = '/viewPatientReport/'+ patient.p_id;
                $location.path(url);
                console.log('location changed');
            };
            $scope.viewlistofPatientEntries = function(){

                var url = '/viewPatient/'+ $rootScope.p_id;
                $http.get(url).success(function(data) {
                    console.log(data);
                    
                    $scope.p_first_name = data.p_first_name;
                    $scope.p_last_name = data.p_last_name;
                    $scope.p_dob = data.p_dob;
                    $scope.p_program = data.p_program; 
                    $scope.p_event_entries = data.p_event_entries;
                    console.log($scope.p_event_entries);

                
                });
            };
            $scope.generatePdf= function(entries){
                console.log(entries);
            /*    var doc = new jsPDF();
                var category = $rootScope.p_id;
                console.log(category);
                for(var i=0;i<entries.length;i++){
                    var entry = entries[i].event_timestamp
                }
                doc.text(20,30,category);
            //    doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
                doc.addPage();
             //   doc.text(20, 20, 'Do you like that?');
                
                doc.save('Test.pdf'); */
            }
        }
    ]);

    //====================CONTROLLER FOR PROGRAMS===============

    //MODAL

    

    //MODAL END


    app.controller('programCtrl', [
        '$scope', 
        '$http', 
        function($scope, $http) {

            $scope.getAllPrograms = function() {

                var url = '/programs/';
                console.log('hello');
                
                $http.get(url).success(function(data) {
                    console.log(data);
                    $scope.programs = data;
                });
            };  
            $scope.addNewProgram = function(program) {

                var url = '/programs/';
                console.log(program);
                $scope.go = false;
                if(program){
                    $scope.go = true;
                }
                if($scope.go){

                    $http.post(url, program).success(function(response, status, headers, config){
                    console.log('success');
                    }).error(function(response, status, headers, config){
                        $scope.error_message = response.error_message;
                    });
                } 
                
            }; 
        }
    ]); 
    
})();