 // select the form and submit
 //save this file ..
 // anugular.registerController
 // addPropertyImg(); 
 var app = angular.module('sbaapp', ['ngResource', 'ngFileUpload', 'ngRoute']);

 // configure our routes
 app.config(function($routeProvider) {
     $routeProvider

     // route for the home page
         .when('/', {
         templateUrl: 'dashboard.html',
         controller: 'dashboardController'
     })

     // route for the about page
     .when('/properties', {
         templateUrl: 'properties.html',
         controller: 'propertiesController'
     })

     // route for the contact page
     .when('/reservations', {
         templateUrl: 'reservations.html',
         controller: 'reservationsController'
     })

     // route for the contact page
     .when('/inbox', {
         templateUrl: 'inbox.html',
         controller: 'inboxController'
     })

     // route for the contact page
     .when('/settings', {
         templateUrl: 'settings.html',
         controller: 'settingsController'
     });




 });

 app.controller("sbaDefaultController", ['$scope', '$resource', 'Upload', function($scope, $resource, Upload) {
     $scope.sbaProj = {};
     $scope.sbaProj.title = "StandbyApps";
     $scope.sbaProj.frmError = "";
     $scope.showProfile = false;
     if(sessionStorage.session_token){
        $scope.showProfile = true;
     }
     $scope.logout = function() {
         $scope.isLoggedin = false;
         sessionStorage.clear();
     };

 }]);


 app.controller('signupfrmCtrl', ['$scope', '$resource', 'Upload', function($scope, $resource, Upload) {
     $scope.master = {
         firstName: "John",
         lastName: "Doe"
     };
     $scope.reset = function() {
         $scope.user = angular.copy($scope.master);
     };
     $scope.reset();
 }]);

 app.controller('loginController', ['$scope', '$resource', '$window', function($scope, $resource, $window) {
     $scope.master = {
         username: '',
         password: '',
         email: '',
     };
     $scope.sbaProj = {};

     $scope.reset = function() {
         $scope.user = angular.copy($scope.master);
     };

     $scope.logout = function() {

         $scope.isLoggedin = false;

         delete $window.sessionStorage.session_token;
     };

     $scope.anonymouslogin = function() {


         var User = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/unauth/anonymousLogin', {
             identifier: '@identifier'
         });

         User.get({
             identifier: $scope.user.identifier
         }, function(data) {

             if (data.success) {
                 //$window.alert('You are now loggedin.'); 
                 //@todo redirect or further op __ 

                 //$scope.reset();  

             } else {
                 //$scope.sbaProj.frmError = data.error;  

                 $window.alert(data.error); // 
             }

         }, function() {
             //error handle 
             $window.alert("Some error occurred. please contact your admin.");

         });

     };

     $scope.resetpass = function() {

         var User = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/unauth/resetPassword', {
             password: '@password',
             reset_token: '@reset_token'
         });

         $scope.user.reset_token = ''; //get token from url -- GET argument token__ 
         User.get({
             password: $scope.user.password,
             reset_token: $scope.user.reset_token
         }, function(data) {

             if (data.success) {
                 $window.alert('your password is changed .');
                 //@todo redirect or further op __ 

                 $scope.reset();
             } else {

                 $scope.sbaProj.frmError = data.error;
             }
         }, function() {
             //error handle 
             $window.alert("Some error occurred. please contact your admin.");

         });

     };

     $scope.forgotpass = function() {

         var User = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/unauth/forgotPassword', {
             username: '@username'
         });

         User.get({
             username: $scope.user.username
         }, function(data) {

             if (data.success) {
                 $window.alert('reset password link send to your email.');
                 //@todo redirect or further op __ 

                 $scope.reset();
             } else {

                 $scope.sbaProj.frmError = data.error;
             }
         }, function() {
             //error handle 
             $window.alert("Some error occurred. please contact your admin.");

         });

     };



     $scope.login = function(cdata) {



         var lvarst = {
             username: '@username',
             password: '@password'
         };
         var lvars = {
             username: $scope.user.username,
             password: $scope.user.password
         };

         //check if facebook token present __ then use that instead of user/pass _ 
         if (cdata != undefined && cdata.facebook_token != undefined) {
             lvarst = {
                 facebook_token: '@facebook_token',
                 options: "FLAG_HOST_ROLE"
             };
             lvars = {
                 facebook_token: cdata.facebook_token,
                 options: "FLAG_HOST_ROLE"
             };
         }
         if (cdata != undefined && cdata.google_access_token != undefined && $window.sessionStorage.session_token == undefined) {
             lvarst = {
                 google_access_token: '@google_access_token',
                 options: "FLAG_HOST_ROLE"
             };
             lvars = {
                 google_access_token: cdata.google_access_token,
                 options: "FLAG_HOST_ROLE"
             };
         }


         var User = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/unauth/login', lvarst);

         //facebook_token, google_access_token, google_refresh_token 
         User.get(lvars, function(data) {

             if (data.success) {

                 $window.sessionStorage.session_token = data.session_token;

                 $scope.isLoggedin = true;

                 var profile = data.user;

                 $scope.fullname = profile.first_name + ' ' + profile.last_name;

                 //$window.alert('Welcome ' + $scope.fullname + ', You are now logged in.'); 

                 //@todo redirect or further op __ 

                 $window.location.href = "profile.html";
                 //$window.location.href = "signup.html"; 

                 //$scope.reset();  

             } else {
                 delete $window.sessionStorage.session_token;

                 $scope.isLoggedin = false;

                 // $window.alert(data.error);  
                 $scope.sbaProj.frmError = data.error;
             }

             $scope.profile = data; //save here.. 

         }, function() {
             //error handle 

         });

     };




     $scope.reset();

 }]);



 //call rest   https://docs.angularjs.org/api/ngResource/service/$resource  TokenHandler', 
 app.controller('registerController', ['$scope', '$resource', 'Upload', '$timeout', function($scope, $resource, Upload, $timeout) {
     $scope.master = {
         first_name: '',
         last_name: '',
         password: '',
         email: '',
         username: '',
         phone: '',
         dob: '',
         image_url: '',
         options: ''
     };
     $scope.pmaster = {
         name: '',
         description: '',
         address_street_1: '',
         address_street_2: '',
         city: '',
         state: '',
         country: '',
         zip_code: ''
     };

     $scope.sbaProj = {};

     if (window.sessionStorage.last_propert_unique_id == undefined) {
         $scope.addPropStatus = "Next";
     } else {
         $scope.addPropStatus = "Done";
     }

     $scope.sbaProj.prop_pic = [];
     $scope.property = {};
     $scope.f = [];
     $scope.user = {};

     $scope.reset = function() {
         $scope.user = angular.copy($scope.master);
     };

     //get user data if already logged-in 

     $scope.register = function() {
         if (window.sessionStorage.session_token == undefined) {
             //fine 
         } else {
             $scope.sbaProj.frmError = 'You are already logged-in with active session.';

             signUpGotoNextStep("step-1");

             return false;
         }

         var nUser = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/unauth/register', {
             username: '@username',
             password: '@password',
             email: '@email',
             first_name: '@first_name',
             last_name: '@last_name',
             options: '@options',
             image_url: '@image_url',
             phone: '@phone',
             dob: '@dob'
         });

         //check no error in form__ 
         $scope.user.username = $scope.user.email;
         $scope.user.options = "FLAG_HOST_ROLE"; // FLAG_TRAVELER_ROLE

         // save with all fields _ {username: 'tester', password: 'tester'} 
         nUser.get($scope.user, function(user) {

             if (user.success) {

                 //alert('You are registered now.'); 

                 window.sessionStorage.session_token = user.session_token;

                 signUpGotoNextStep("step-1");
                 // window.location.href = "addproperty.html"; 

                 // $scope.reset(); 

             } else {
                 // formError 
                 $scope.sbaProj.frmError = user.error;

                 //alert(user.error); 
             }

             //$scope.profile = user; //save here.. 
         }, function(error) {
             //error handle 

         });

     };

     $scope.getHostProperty = function() {

         var ApiRes = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/property/myProperties', {}, {
             get: {
                 'method': 'GET',
                 headers: {
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'Authorization': '' + window.sessionStorage.session_token
                 }
             }
         });

         ApiRes.get({}, function(data) {

             if (data.success) {

             }

         });


     };



     $scope.addPropertyImg2 = function(file, errFiles, e_pic_id) {
         var imgElem = document.getElementById("prop_pic_" + e_pic_id);


         if (window.sessionStorage.last_propert_unique_id == undefined) {
             //property not added yet... try that first __ 

             $scope.addProperty();

             setTimeout(function() {
                 $scope.addPropertyImg2(file, errFiles, e_pic_id);
             }, 5000);

             //$scope.sbaProj.frmError = 'Please create property first.';  
             //return false;  
         }

         if (window.sessionStorage.last_propert_unique_id == undefined) {
             return false;
         }

         $scope.property.property_id = window.sessionStorage.last_propert_unique_id;


         //alert(input.files[0]); 
         if (window.sessionStorage.session_token == undefined) {
             $scope.sbaProj.frmError = 'You session is expired. Please login again.';
             return false;
         }

         //$scope.getHostProperty(); 
         var rurl = 'http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/property/postPhoto?property_id=' + $scope.property.property_id;

         $scope.f[e_pic_id] = file;

         $scope.errFile = errFiles && errFiles[0];

         if (file) {

             file.upload = Upload.upload({
                 url: rurl,
                 data: {
                     photo: file
                 }, //, 'property_id' : $scope.property.property_id  
                 headers: {
                     'Authorization': window.sessionStorage.session_token
                 },
                 disableProgress: false,
             });

             file.upload.then(function(response) {
                 //console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);

                 $timeout(function() {

                     if (response.data.success) { //property added__   need property id __ 

                         // alert("Propery "+response.data.property.name+" created now.");  

                         imgElem.src = response.data.media.thumbnail_url;

                         $scope.sbaProj.prop_pic[e_pic_id] = 1;

                         //add this property image in this box __ 

                     } else {

                         $scope.sbaProj.frmError = response.data.error;


                     }
                 });



             }, function(response) { //error 

                 $scope.sbaProj.frmError = "User is not authorized.";

             }, function(evt) {

                 file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                 //console.log('progress: ' + file.progress + '% ' + evt.config.data.file.name); 

             });
         }




     };



     $scope.addProperty = function() {

         if (window.sessionStorage.last_propert_unique_id != undefined) {
             //redirect to verify -- 
             signUpGotoNextStep("step-2");

             //window.location.href = "verify-id.html"; 

             return false;
         }

         if (window.sessionStorage.session_token == undefined) {
             $scope.sbaProj.frmError = 'You session is expired. Please login again.';
             return false;
         }

         var ApiRes = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/property/create', {}, {
             save: {
                 'method': 'POST',
                 headers: {
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'Authorization': '' + window.sessionStorage.session_token
                 }
             }
         });
         // {  name:'@name', description:'@description',  address_street_1:'@address_street_1', city:'@city', 
         // state:'@state', country:'@country', zip_code:'@zip_code', address_street_2:'@address_street_2', } 
         //ApiRes = tokenHandler.wrapActions( ApiRes, ["save"] ); 

         $scope.property.name = 'property name';
         $scope.property.description = 'property description';
         //$scope.property.session_token = window.sessionStorage.session_token; 
         //$scope.property.access_token = window.sessionStorage.session_token; 

         //$scope.property
         ApiRes.save(("name=" + $scope.property.name + "&description=" + $scope.property.description + "&address_street_1=" + $scope.property.address_street_1 + "&address_street_2=" + $scope.property.address_street_2 + "&city=" + $scope.property.city + "&state=" + $scope.property.state + "&zip_code=" + $scope.property.zip_code + "&country=" + $scope.property.country), function(data) { // 

             if (data.success) { //property added__   need property id __   

                 $scope.addPropStatus = 'Done';

                 window.sessionStorage.last_propert_unique_id = data.property.unique_id;

                 //alert("Propery "+data.property.name+" created now. Continue with addding images..");   

                 //set property id in session __  for add images __ 


             } else {

                 $scope.sbaProj.frmError = data.error;

                 //$window.alert(data.error); // 
             }

         }, function(error) {
             //error handle 
             $scope.sbaProj.frmError = "User is not authorized.";

             //$window.alert("Some error occurred. please contact your admin.");  

         });

     };

     $scope.getProfile = function() {

         if (window.sessionStorage.session_token == undefined) {
             //$scope.sbaProj.frmError = 'You session is expired. Please login again.';  
             return false;
         }

         var User = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/user/profile', {}, {
             get: {
                 'method': 'GET',
                 headers: {
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'Authorization': '' + window.sessionStorage.session_token
                 }
             }
         });

         User.get({}, function(data) {

             if (data.success) {

                 $scope.user = data.user;

                 signUpGotoNextStep("step-1");

             } else {

                 $scope.sbaProj.frmError = data.error;
             }

         }, function() {
             //error handle 
             $window.alert("Some error occurred. please contact your admin.");

         });

     };

     $scope.confirm_email = function() {

         if (window.sessionStorage.session_token == undefined) {
             $scope.sbaProj.frmError = 'You session is expired. Please login again.';
             return false;
         }

         var User = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/user/verifyEmail', {
             email: '@email'
         }, {
             get: {
                 'method': 'GET',
                 headers: {
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'Authorization': '' + window.sessionStorage.session_token
                 }
             }
         });

         User.get({
             email: $scope.user.email
         }, function(data) {

             if (data.success) {

                 $scope.sbaProj.scemail = 1; //scphone 

                 //@todo redirect or further op __ 

                 //$scope.reset();  

             } else {

                 $scope.sbaProj.frmError = data.error;
             }

         }, function() {
             //error handle 
             $window.alert("Some error occurred. please contact your admin.");

         });

     };

     $scope.confirm_phone = function() {

         if (window.sessionStorage.session_token == undefined) {
             $scope.sbaProj.frmError = 'You session is expired. Please login again.';
             return false;
         }

         var User = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/user/verifyPhone', {
             phone: '@phone'
         }, {
             get: {
                 'method': 'GET',
                 headers: {
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'Authorization': '' + window.sessionStorage.session_token
                 }
             }
         });

         User.get({
             phone: $scope.user.phone
         }, function(data) {

             if (data.success) {

                 $scope.sbaProj.scphone = 1; // 

                 //@todo redirect or further op __ 

                 //$scope.reset();  

             } else {

                 $scope.sbaProj.frmError = data.error;
             }

         }, function() {
             //error handle 
             $window.alert("Some error occurred. please contact your admin.");

         });

     };


     $scope.getProfile();

     //$scope.reset(); 

 }]);

 // // Property controller
 //app.controller("sbaPropertyController", [ '$scope', '$resource', '$http','Upload',  function($scope, $resource,$http, Upload) {
 //
 //    $scope.getProps = function () {
 //        var User = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/property/myProperties', {  }, {get: { 'method': 'GET', headers: {  'Content-Type': 'application/x-www-form-urlencoded' , 'Authorization': '' + window.sessionStorage.session_token } }} );
 //
 //        User.get( {}, function(data){
 //
 //            if(data.success ) {
 //
 //                $scope.properties = data.properties;
 //
 //
 //
 //            } else {
 //
 //                //$scope.sbaProj.frmError = data.error;
 //            }
 //
 //        }, function () {
 //            //error handle
 //            $window.alert("Some error occurred. please contact your admin.");
 //
 //        });
 //    }
 //
 //    $scope.getProps();
 //
 //}]);

 app.controller("desktopNav", ['$scope', '$resource', '$http', 'Upload', function($scope, $resource, $http, Upload) {

     // create a message to display in our view
     jQuery('.desktopNav li').on('click', function(){
        jQuery('.desktopNav li').removeClass('active');
        jQuery(this).addClass('active');
     })
 }]);
 app.controller("dashboardController", ['$scope', '$resource', '$http', 'Upload', function($scope, $resource, $http, Upload) {

     // create a message to display in our view
     $scope.message = 'Dashboard Page Goes Here!';

 }]);

 app.controller("propertiesController", ['$scope', '$resource', '$http', 'Upload', '$timeout', function($scope, $resource, $http, Upload, $timeout) {
    app.apiRoot = 'http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api';
    var apiUrls = {
        'postNew': app.apiRoot + '/property/create',
        'updateAmenities': app.apiRoot + '/property/updateAmenities',
        'updateMetadata' : app.apiRoot + '/property/update', //call at the last
        'updateSchedule' : app.apiRoot + '/property/updateSchedule'
    };

    $scope.f = [];
    $scope.sbaProj = {};
    $scope.sbaProj.prop_pic = [];

     if (window.sessionStorage.session_token !== undefined) {
        $scope.manageProperty = function(prop){
            $scope.formData = prop;
            jQuery('.property-wrapper .list-existing').hide();
            jQuery('.property-wrapper .add-new').show();
            $scope.updateProperty = true;
            $scope.updatePropertyId = prop.unique_id;

        }
         $scope.getProps = function() {
             var User = $resource('http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/property/myProperties', {}, {
                 get: {
                     'method': 'GET',
                     headers: {
                         'Content-Type': 'application/x-www-form-urlencoded',
                         'Authorization': '' + window.sessionStorage.session_token
                     }
                 }
             });

             User.get({}, function(data) {

                 if (data.success) {

                     $scope.properties = data.properties;
                     setTimeout(function() {
                         jQuery('section#account-property .existing-property .prop-details span.stars').stars();
                     }, 10)


                 } else {

                     //$scope.sbaProj.frmError = data.error;
                 }

             }, function() {
                 //error handle
                 $window.alert("Some error occurred. please contact your admin.");

             });

             function validateNewPropertyFrom() {
                 var newPropForm = jQuery("#new-property-form");
                 jQuery(".frm").hide();
                 jQuery("#sf1").show();

                 jQuery(".next").click(function() {
                     jQuery(".frm").hide();
                     jQuery("#sf" + jQuery(this).attr('id').split('_')[1]).show();
                     jQuery('#mobile-new-property-navigation > option:selected').removeAttr('selected').next('option').attr('selected', 'selected');
                     jQuery('#form-nav li').find('span').removeClass('active ');
                     jQuery('#form-nav li#load-frm_' + jQuery(this).attr('id').split('_')[1]).find('span').addClass('active ');
                 });



                 jQuery('#mobile-new-property-navigation').on('change', function() {
                     var selectedIndex = jQuery(this).prop('selectedIndex') + 1;
                     jQuery(".frm").hide();
                     jQuery("#sf" + selectedIndex).show();

                 });

                 jQuery('#form-nav li').on('click', function() {

                     var selectedIndex = jQuery(this).attr('id').split('_')[1];
                     jQuery('#form-nav li').find('span').removeClass('active ');
                     jQuery(this).find('span').addClass('active ');
                     jQuery(".frm").hide();
                     jQuery("#sf" + selectedIndex).show();


                 });

             }

             jQuery('.list-property-text').on('click', function(){
                jQuery('.property-wrapper .list-existing').hide();
                jQuery('.property-wrapper .add-new').show();
             });

             if (jQuery('#new-property-form')) {
                 validateNewPropertyFrom();
             }
             // validate and submit form
             $scope.formData = {};



             // process the form
             $scope.processForm = function() {

                var newProp = { 
                            method: 'POST',
                            url: apiUrls.postNew,
                            data: $.param($scope.formData), // pass in data as strings
                             headers: {
                                 'Content-Type': 'application/x-www-form-urlencoded',
                                 'Authorization': '' + window.sessionStorage.session_token
                             }
                        },
                    updateProp = { 
                            method: 'POST',
                            url: apiUrls.updateMetadata,
                            data: $.param($scope.formData) + '&property_id=' + $scope.updatePropertyId, // pass in data as strings
                             headers: {
                                 'Content-Type': 'application/x-www-form-urlencoded',
                                 'Authorization': '' + window.sessionStorage.session_token
                                 
                             }
                        };
                 $http(($scope.updateProperty) ? updateProp : newProp)
                     .success(function(data) {
                         console.log(data);

                         if (!data.success) {
                             // if not successful, bind errors to error variables
                             //$scope.errorName = data.errors.name;
                             //$scope.errorSuperhero = data.errors.superheroAlias;
                         } else {
                            var propUpdated = function (message){
                                $scope.message = message;
                                 var ask = window.confirm("Your property is added. Click yes to Continue");
                                 if (ask) {
                                        document.location.href = "profile.html";
                                    }
                            }
                            if ( newProp ) {
                                $scope.updatePropertyId = data.property.unique_id;
                                $scope.imagesDone = 0;
                                var callback = function (){
                                    propUpdated(data.message)
                                }
                                $scope.uploadImages(callback);
                            }else{
                             // if successful, bind success message to message
                                propUpdated(data.message)

                            }
                         }
                     });
             };
         }

         $scope.getProps();

         $scope.images = [];
         $scope.imagesDone = 0;
         $scope.imagesDone = function(){

         }

         $scope.uploadImages = function(cb){
            if ($scope.images.length) {
                $.each($scope.images, function(i, v){
                    $scope.addPropertyImg2(v.file, v.err, v.e_pic_id, cb);
                });
                // $scope.imagesDone = cb;
            }else{
                cb.call();
            }
         }


        $scope.addPropertyImg2 = function(file, errFiles, e_pic_id, cb) {

            if ( !$scope.updatePropertyId ) {
                $scope.images.push({
                    'file': file,
                    'err': errFiles,
                    'e_pic_id': e_pic_id
                });
                return;
            }


         var imgElem = document.getElementById("prop_pic_" + e_pic_id);
         var propertyId = $scope.updatePropertyId;
         var apiUrl = 'http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api/property/postPhoto?property_id=' + propertyId;

         $scope.f[e_pic_id] = file;

         $scope.errFile = errFiles && errFiles[0];



         if (file) {
             file.upload = Upload.upload({
                 url: apiUrl,
                 data: {
                     photo: file
                 },
                 headers: {
                     'Authorization': window.sessionStorage.session_token
                 },
                 disableProgress: false,
             });

             file.upload.then(function(response) {
                 $timeout(function() {
                    // console.log(response)
                     if (response.data.success) {
                         imgElem.src = response.data.media.thumbnail_url;
                         $scope.sbaProj.prop_pic[e_pic_id] = 1;
                         if (cb){
                            $scope.imagesDone++;
                            if($scope.images.length == $scope.imagesDone){
                                cb.call();
                            }
                         }
                         // alert('done');
                         // console.log(e_pic_id)
                         // console.log($scope.sbaProj.prop_pic[e_pic_id]);
                     } else {
                         // $scope.sbaProj.frmError = response.data.error;
                     }
                 });
             }, function(response) { //error 
                 $scope.sbaProj.frmError = "User is not authorized.";
             }, function(evt) {
                 file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
             });
         }




     };


     } else {
         window.alert("please log in")
     }


 }]);



 app.controller("inboxController", ['$scope', '$resource', '$http', 'Upload', function($scope, $resource, $http, Upload) {

     // create a message to display in our view
     $scope.message = 'Inbox Page Goes Here!';

 }]);

 app.controller("settingsController", ['$scope', '$resource', '$http', 'Upload', function($scope, $resource, $http, Upload) {

     // create a message to display in our view
     $scope.message = 'Settings Page Goes Here!';

 }]);

 jQuery(document).ready(function() {
     var navListItems = jQuery('div.setup-panel div a'),
         allWells = jQuery('.setup-content'),
         allNextBtn = jQuery('.nextBtn');
     //$star = jQuery('section#account-property .existing-property .prop-details span.stars');

     allWells.hide();

     navListItems.click(function(e) {
         e.preventDefault();

         var $target = jQuery(jQuery(this).attr('href')),
             $item = jQuery(this);

         if (!$item.hasClass('disabled')) {
             navListItems.removeClass('btn-primary').addClass('btn-default');
             $item.addClass('btn-primary');
             allWells.hide();
             $target.show();
             $target.find('input:eq(0)').focus();
         }
     });

     allNextBtn.click(function() {
         // step-1 , step-2 
         var curStep = jQuery(this).closest(".setup-content"),
             curStepBtn = curStep.attr("id"),
             nextStepWizard = jQuery('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
             curInputs = curStep.find("input[type='text'],input[type='url']"),
             isValid = true;

         jQuery(".form-group").removeClass("has-error");
         for (var i = 0; i < curInputs.length; i++) {
             if (!curInputs[i].validity.valid) {
                 isValid = false;
                 jQuery(curInputs[i]).closest(".form-group").addClass("has-error");
             }
         }

         if (isValid)
             nextStepWizard.removeAttr('disabled').trigger('click');
     });

     jQuery('div.setup-panel div a.btn-primary').trigger('click');

     if (window.sessionStorage.session_token == undefined) {
         //fine 
     } else {
         //remove disabled 
         jQuery('div.setup-panel div a').removeAttr('disabled');
     }

     // calculate star
     //if($star){
     //    $star.stars();
     //}




 });

 function signUpGotoNextStep(stepid) {
     var curStepBtn = stepid;

     var nextStepWizard = jQuery('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a");

     nextStepWizard.removeAttr('disabled').trigger('click');

 }

 // Star rating calculation

 $.fn.stars = function() {
     return $(this).each(function() {
         $(this).html(jQuery('<span />').width(Math.max(0, (Math.min(5, parseFloat($(this).html())))) * 16));
     });
 }