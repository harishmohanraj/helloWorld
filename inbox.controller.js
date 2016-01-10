//API Root
app.apiRoot = 'http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api';

app.config(function($routeProvider) {
    $routeProvider
    // route for the home page
        .when('/inbox/claims/:id', {
            templateUrl : 'partials/claim.html',
            controller  : 'inboxController'
        }).when('/inbox/conversations/:id', {
            templateUrl : 'inbox.conversations.html',
            controller  : 'inboxController',
            reloadOnSearch: false
        }).when('/inbox/messages/:id', {
            templateUrl : 'inbox.conversations.html',
            controller  : 'inboxController',
            reloadOnSearch: false
        });
    }
);

//Inbox Controller
app.controller("inboxController", [ '$scope', '$resource', '$http','Upload',  function($scope, $resource,$http, Upload) {
    var apiUrls = {
        'messages': app.apiRoot + '/host/message/getMessages',
        'conversations': app.apiRoot + '/host/message/getConversations',
        'claims': app.apiRoot + '/host/claim/getClaimMessages'
    };
    apiUrls = {
        'messages': 'services/inbox/getMessages.json',
        'conversations': 'services/inbox/getConversations.json',
        'claims': 'services/inbox/getClaims.json'
    }

    function resetFlags () {
        $scope.isConversationView = false;
        $scope.isConversations = false;
        $scope.isMessages = false;
        $scope.messageType = '';
        $('html').removeClass('conversation');
    }

    resetFlags();
  

    $scope.getMessages = function ($conversationId) {
        resetFlags();
        $scope.isMessages = true;
        $scope.messageType = 'messages';
        var optParams = {};
        if ( $conversationId ){
            optParams = { 'conversation-id' : $conversationId };
        }
        var Messages = $resource(apiUrls.messages, optParams, {get: { 'method': 'GET', headers: {  'Content-Type': 'application/x-www-form-urlencoded' , 'Authorization': '' + window.sessionStorage.session_token } }} );
        Messages.get( {}, function(data){
            if( data.success ) {
                $scope.messages = data.messages;
            }
        }, function () {
            //error handle
            window.location.href = 'index.html';
        });
    }

    $scope.getConversations = function () {
        resetFlags();
        $scope.isConversations = true;
        $scope.isConversationView = true;
        $scope.messageType = 'conversations';
        var Conversations = $resource(apiUrls.conversations, {  }, {get: { 'method': 'GET', headers: {  'Content-Type': 'application/x-www-form-urlencoded' , 'Authorization': '' + window.sessionStorage.session_token } }} );
        Conversations.get( {}, function(data){
            if( data.success ) {
                $scope.messages = data.conversations;
                $('html').addClass('conversation');
            }
        }, function () {
            //error handle
            window.location.href = 'index.html';
        });
    }

    $scope.getClaims = function ($claimId) {
        resetFlags();
        $scope.isClaims = true;
        $scope.messageType = 'claims';
        var optParams = {};
        if ( $claimId ){
            optParams = { 'claim-id' : $claimId };
        }
        var Conversations = $resource(apiUrls.claims, optParams, {get: { 'method': 'GET', headers: {  'Content-Type': 'application/x-www-form-urlencoded' , 'Authorization': '' + window.sessionStorage.session_token } }} );
        Conversations.get( {}, function(data){
            if( data.success ) {
                $scope.messages = data.messages;
            }
        }, function () {
            //error handle
            window.location.href = 'index.html';
        });
    }

    $scope.getDetails = function ($type, $id) {
       resetFlags();
       window.location.hash = 'inbox/' + $type + '/' + $id;
       return;
       if ($type == 'conversations'){
            $scope.getMessages($id);
       }

       if ($type == 'messages'){
            getMessageDetail($id);
       }

       if ($type == 'claims'){
            resetFlags();
            $scope.isClaims = true;
            getClaimDetail($id);
       }
       $scope.isConversationView = false;
    }

    function getClaimDetail($id) {
        // $scope.getClaims($id);
    }

    function getMessageDetail ($id) {
        alert($id);
    }

    $scope.listMessages = function () {
        $scope.isConversationView = false;
        $scope.getMessages();
    }

    //Load Messages by default
    $scope.getConversations();
    // $scope.isConversationView = false;

}]);
