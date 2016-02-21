'use strict';

/**
 * @ngdoc overview
 * @name Diabetik App
 * @description
 * # CaseWorker System
 *
 * Main module of the application.
 */
(function(){

    var app = angular.module('DiabetikApp');

    //====================CONTROLLER FOR CaseWorker RECORD PAGE===============
    app.controller('allCaseWorkersCtrl', [
        '$scope', 
        '$http', 
        function($scope, $http) {

            $scope.getAllCaseWorkers = function() {

                var url = '/CaseWorkers/';
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

    //======CONTROLLER FOR REGISTER CaseWorker PAGE=========

    //DIRECTIVE to validate unique CaseWorker id's
    app.directive('idValidation', function($http, $q) {

    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.id = function(test_id) {
                console.log('modelValue %s', test_id);
                var url = '/caseWorkerUniqueIdCheck/' + test_id;
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
    app.controller('singleCaseWorkerCtrl',[
        '$scope',
        '$rootScope', 
        '$http',
        '$location', 
        '$routeParams',
        function ($scope, $rootScope, $http, $location, $routeParams) {

            $rootScope.hideAlert = true;
        
            //=======REGISTER A CaseWorker===================
            $scope.addCaseWorker = function(caseWorker,isValid){
                var url = '/registerCaseWorker/';
                console.log(isValid);

                if(isValid){
                    console.log(caseWorker);
                    $http.post(url, caseWorker).success(function(response, status, headers, config){
                        console.log('success');
                        if(response.message=='New caseWorker Registered'){
                            console.log('rootScope caseWorker assigned');
                            $rootScope.c_id = caseWorker.c_id;
                            var c_id = caseWorker.c_id;
                            var newPath = '/CaseWorkerRegistrationDetails/'+ c_id;
                            $location.path(newPath);
                        }
                    }).error(function(response, status, headers, config){
                        $scope.error_message = response.error_message;
                    });
                }
            };

            $scope.getUrlParamtoViewCaseWorker = function(){

                $rootScope.c_id = $routeParams.c_id;
                console.log('function ran and rootscope c_id is: %s',$rootScope.c_id);
            };

            //============VIEW A CaseWorker=====================
            $scope.viewRegisteredCaseWorker = function(){

                var url = '/viewCaseWorker/'+ $rootScope.c_id;
                $http.get(url).success(function(data) {
                    console.log(data);
                    $scope.caseWorker = data;
                    if(data.c_active==true){
                        $scope.caseWorker.c_status = 'Active';
                    } else{
                        $scope.caseWorker.c_status = 'De-active';
                    }
                });
            };
            $scope.viewCaseWorker = function(caseWorker){
                
                console.log('object to view: %s', caseWorker.c_token);
                $rootScope.c_id = caseWorker.c_id;
                var url = '/viewCaseWorker/'+ caseWorker.c_id;
                $location.path(url);
                console.log('location changed');
            };

            //============EDIT A CaseWorker=======================
            $scope.editCaseWorkerRoute = function(caseWorker){

                console.log('EDIT CaseWorker ROUTE PARAM OBJECT NAME %s', caseWorker.c_first_name);
                var url = '/editCaseWorker/'+ caseWorker.c_id;
                $location.path(url);
                console.log('edit location changed');
            };
            $scope.getUrlParamtoEditCaseWorker = function(){

                $rootScope.c_id = $routeParams.c_id;
                console.log('EditcaseWorker function ran and rootscope id is: %s',$rootScope.c_id);
            };
            $scope.editCaseWorker = function(caseWorker, isValid){

                var url = '/editCaseWorker/'+caseWorker.c_id;
                console.log('editCaseWorker function called');
                console.log(caseWorker);
                console.log(isValid);

                if(isValid){
                    console.log(caseWorker);
                    $http.put(url, caseWorker).success(function(response, status, headers, config){
                        console.log('success');
                        if(response.message=='caseWorker updated'){
                            $scope.alert = {   
                                msg:  'caseWorker profile updated successfully!!' 
                            };
                            alert("caseWorker profile updated");
                            var url2='/viewCaseWorker/'+caseWorker.c_id;
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
                $scope.caseWorker.c_token = token;
                console.log('token in generateToken %s', token);
                return token;   
            };
            //============DEACTIVATE A CaseWorker=======================
            $scope.toggleCaseWorkerStatus = function(caseWorker){
                var url = '/toggleCaseWorkerStatus/'+caseWorker.c_id;
                console.log('deactivateCaseWorker called');

                $http.put(url).success(function(response, status, headers, config){
                        console.log('success');
                        if(response.message=='caseWorker profile status changed'){
                            if($scope.caseWorker.c_status=='Active'){
                                alert("CaseWorker profile Deactivated!");
                            }
                            else{
                                alert("CaseWorker profile Activated!");
                            }                               
                            var url2='/CaseWorkers';
                            $location.path(url2);
                        }
                    }).error(function(response, status, headers, config){
                        $scope.error_message = response.error_message;
                    });
            };
        }
    ]);
    

    var updatePatient = function(http, patient) {
                
        var url = '/envelopes/' + envelope._id;
        
        http.put(url, envelope).success
            (function(response, status, headers, config){
                
            }).error(function(response, status, headers, config){
                $scope.error_message = response.error_message;
                
        });
    };
})();