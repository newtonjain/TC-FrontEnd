angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $firebaseArray, $ionicModal, $window) {

  var _self = this;
//  var window = $windowProvider.$get();

$scope.level = 0 ;
  $scope.steps = 0;

      $http.get('https://disrupt-hack-api.herokuapp.com/api/v1/users/12345')
    .success(function (data, status, headers, config) {
      console.log('datagetting back', data);
      $scope.level = data.level;
      $scope.steps = parseInt(data.steps);
    }).error(function (data, status, headers, config) {
        console.log('There was a getting your information' + JSON.stringify(data) + JSON.stringify(status));
        
    });




console.log('in ctrl',$window);
document.addEventListener('deviceready', function() {
    console.log("Device ready");
var counter = $scope.steps;
    var successHandler = function (pedometerData) {
       
            $scope.steps= $scope.steps + pedometerData.numberOfSteps; 
              console.log('stepping', $scope.steps);
              $scope.$apply();

          if($scope.steps >= counter + 10){
            var stepsend = {steps: $scope.steps};
                  $http.post('https://disrupt-hack-api.herokuapp.com/api/v1/users/12345/steps', stepsend)
                .success(function (data, status, headers, config) {
                  console.log('getting level', JSON.stringify(data), JSON.stringify(status));
                  $scope.level = data.level;
        
                }).error(function (data, status, headers, config) {
                    console.log('There was a error' + JSON.stringify(data) + JSON.stringify(status));
                });
                counter = $scope.steps
        }
}

var onError =  function(err) {
console.log(err);
};

$window.pedometer.startPedometerUpdates(successHandler, onError);

})


  //Opens the login modal as soon as the controller initializes
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modallogin) {
      $scope.modallogin = modallogin;
      $scope.modallogin.show();
  });

  // Used to login 
  $scope.login = function() {
    console.log('login request');
    var ref = new Firebase("https://poll2roll.firebaseio.com/");

    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        // the access token will allow us to make Open Graph API calls.
        console.log("Logged in as", authData);
        $scope.authData = authData.facebook;
        $scope.$apply();
      }
    },
    {
    scope: "email" // the permissions requested
    });
  };

  $scope.savefbinfo  = function() {
    $scope.modallogin.hide();
    _self.userExists = false;

    var userData = {
      "name": $scope.authData.displayName,
      "email": $scope.authData.email
    };

    //   $http.post('http://sample-env.57ce6ghwcr.us-west-2.elasticbeanstalk.com', userData)
    // .success(function (data, status, headers, config) {
    //   console.log('saving data to customer', JSON.stringify(data), JSON.stringify(status));
    // }).error(function (data, status, headers, config) {
    //     console.log('There was a problem posting your information' + JSON.stringify(data) + JSON.stringify(status));
    // });

  };
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})






.controller('AccountCtrl', function($scope, $window, $http) {


        google.charts.load('current', {'packages':['gauge']});
      google.charts.setOnLoadCallback(drawChart);


       function drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Level', $scope.level]
        ]);

        var options = {
          width: 180, height: 300,
          redFrom: 8, redTo: 10,
          yellowFrom:6, yellowTo: 8,
          minorTicks: 1,
          max: 10
        };

        var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

        chart.draw(data, options);

        // setInterval(function() {
        //   data.setValue(0, 1, 5);
        //   chart.draw(data, options);
        // }, 10000);

        
      }


});
