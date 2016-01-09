//API Root
app.apiRoot = 'http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api';

// app.createApi = function($resource, path, options) {
//     path = app.apiRoot + path;
//     var paramDefaults = options.paramDefaults || {},
//         method = options.method || 'get',
//         contentType = options.contentType || 'application/x-www-form-urlencoded',
//         authorization = noAuth? '' : 
//     var headers = {
//         'Content-Type': contentType,
//         'Authorization': '' + window.sessionStorage.session_token}
//     }
//     var apiRequest = $resource( path, paramDefaults, 
//         {
//             get: { 
//                 'method': method, 
//                 'headers': headers
//             }
//         }
//     );
//     return apiRequest
// }
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

    $scope.isConversationView = true;
    $scope.isConversations = false;
    $scope.isMessages = false;

    $scope.getMessages = function () {
        $scope.isConversations = false;
        $scope.isMessages = true;
        $scope.isClaims = false;
        var Messages = $resource(apiUrls.messages, {  }, {get: { 'method': 'GET', headers: {  'Content-Type': 'application/x-www-form-urlencoded' , 'Authorization': '' + window.sessionStorage.session_token } }} );
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
        $scope.isConversations = true;
        $scope.isMessages = false;
        $scope.isClaims = false;
        var Conversations = $resource(apiUrls.conversations, {  }, {get: { 'method': 'GET', headers: {  'Content-Type': 'application/x-www-form-urlencoded' , 'Authorization': '' + window.sessionStorage.session_token } }} );
        Conversations.get( {}, function(data){
            if( data.success ) {
                $scope.messages = data.conversations;
            }
        }, function () {
            //error handle
            window.location.href = 'index.html';
        });
    }

    $scope.getClaims = function () {
        $scope.isConversations = false;
        $scope.isMessages = false;
        $scope.isClaims = true;
        var Conversations = $resource(apiUrls.claims, {  }, {get: { 'method': 'GET', headers: {  'Content-Type': 'application/x-www-form-urlencoded' , 'Authorization': '' + window.sessionStorage.session_token } }} );
        Conversations.get( {}, function(data){
            if( data.success ) {
                $scope.messages = data.messages;
            }
        }, function () {
            //error handle
            window.location.href = 'index.html';
        });
    }

    $scope.listMessages = function () {
        $scope.isConversationView = false;
        $scope.getMessages();
    }

    //Load Messages by default
    $scope.getConversations();


}]);