//API Root
app.apiRoot = 'http://strabbodevapi-211215818.us-east-1.elb.amazonaws.com/standbyapps-server/api';

//Reservation Controller
app.controller("reservationsController", ['$scope', '$resource', '$http', 'Upload', function($scope, $resource, $http, Upload) {
    var apiUrls = {
        'upcoming': app.apiRoot + '/traveler/upcomingTrips',
        'past': app.apiRoot + '/traveler/pastTrips'
    };
    apiUrls = {
        'upcoming': 'services/reservations/upcomingTrips.json',
        'past': 'services/reservations/pastTrips.json'
    }

    $scope.isUpcomingView = true;
    $scope.isPastView = false;
    $scope.displayReview = false;

    $scope.getUpcomingEvent = function() {
            var upcomingTrips = $resource(apiUrls.upcoming, {}, {
                get: {
                    'method': 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': '' + window.sessionStorage.session_token
                    }
                }
            });
            upcomingTrips.get({}, function(data) {
                if (data.success) {
                    $scope.bookings = data.bookings;
                    //$scope.displayReview = false;
                }
            }, function() {
                //error handle
                //window.location.href = 'index.html';
            });
        }
        // get past data
        $scope.getPastEvent = function() {
            var upPastTrips = $resource(apiUrls.past, {}, {
                get: {
                    'method': 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': '' + window.sessionStorage.session_token
                    }
                }
            });
            upPastTrips.get({}, function(data) {
                if (data.success) {
                    $scope.bookings = data.bookings;
                    //$scope.displayReview = true;

                }
            }, function() {
                //error handle
                //window.location.href = 'index.html';
            });
        }
        // Change select box
    jQuery('#reservation-filter').on('change', function() {
        var selectedValue = jQuery(this).val();
        if (selectedValue === 'previous') {
            // make json call for past here
            $scope.getPastEvent();
            $scope.displayReview = true;
            //jQuery('.reservation-wrapper .thumbnail .guest.previous').addClass('inline');
        } else {
            // make json call for upcoming here
            $scope.getUpcomingEvent();
            $scope.displayReview = false;
            //jQuery('.reservation-wrapper .thumbnail .guest.previous').removeClass('inline');
        }
    });

    // submit a reviewq
    $scope.callForPastEvent = function(){
        console.log("calling")
        $('.submit-review-signup , .make-claim-signup').magnificPopup({
            type: 'inline',
            midClick: true,
            callbacks: {
                open: function() {
                    $('html').css({
                        'overflow': 'hidden',
                        'height': '100%'
                    });
                    $('body').css({
                        'overflow': 'hidden',
                        'height': '100%'
                    });
                },
                close: function() {
                    $('html').css({
                        'overflow': 'auto',
                        'height': 'auto'
                    });
                    $('body').css({
                        'overflow': 'auto',
                        'height': 'auto'
                    });
                }
            }
        });
    }

    // make a claim

   $scope.listUpcoming = function () {
        $scope.isUpcomingView = true;
        $scope.isPastView = false;
        $scope.displayReview = false;
        
        $scope.getUpcomingEvent();
        
    }

    $scope.listPast = function () {
        $scope.isPastView = true;
        $scope.isUpcomingView = true;
        $scope.displayReview = true;
        //$scope.callForPastEvent();
        $scope.getPastEvent();

    }

    //Load Messages by default
    $scope.getUpcomingEvent();
}]);