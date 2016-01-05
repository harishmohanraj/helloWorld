

function renderGPButton() {
      gapi.signin2.render('gplusSignInBtn', {
        'scope': 'https://www.googleapis.com/auth/plus.login',
        'width': 300,
        'height': 41,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSignInGP,
        'onfailure': onFailureGP,
      });
    }
  
function onFailureGP(error) {
      console.log(error);
 }

function onSignInGP(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        
        console.log("ID: " + profile.getId()); // Don't send this directly to your server! 

        var id_token = googleUser.getAuthResponse().id_token; 
        var gaccess_token = googleUser.getAuthResponse().access_token; 

        console.log(googleUser.getAuthResponse()); 
        
        if(id_token != undefined && id_token != '') { 
            //alert(profile.getName()); 
            angular.element(document.getElementById('logincntr')).scope().login({google_access_token: gaccess_token}); //login  
        } 
        
        console.log("Name: " + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());
        
        // The ID token you need to pass to your backend:
        
        console.log("ID Token: " + id_token);
      }; 
  
   // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.

      angular.element(document.getElementById('logincntr')).scope().login({facebook_token: response.authResponse.accessToken}); //login  

      console.log(response.authResponse.accessToken);
      
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      // document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      //document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    } 
  }
  
  function showFbLoginDialog() {
     FB.login(function(response) {
         statusChangeCallback(response);
    }, {scope: 'public_profile,email'});
  } 
   
    // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1539311799720367',
      xfbml      : true,
      version    : 'v2.5'
    });

    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    }); 

  };
  
  //load facebook SDK 
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk')); 


  function testAPI() {
    console.log('Welcome!  Fetching your information.... '); 

    FB.api('/me', function(response) { 
      console.log('Successful login for: ' + response.name);
      //document.getElementById('status').innerHTML =   'Thanks for logging in, ' + response.name + '!'; 
    });
  }

