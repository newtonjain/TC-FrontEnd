angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $firebaseArray, $ionicModal, $window) {

  var _self = this;
//  var window = $windowProvider.$get();

$scope.level = 0;
  $scope.steps = 0;

  $scope.progessValue = 85;

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
                .success(function (data, status) {
                  
                  $scope.level = data.level;
                   $scope.progessValue = 100;
                   console.log('getting level', $scope.level);
                   
    
                }).error(function (data, status) {
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

.controller('DashCtrl', function($scope, $window, $ionicModal) {

     $ionicModal.fromTemplateUrl('templates/healthy.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalhealth = modal;
  });
    $scope.closeHealth = function() {
    $scope.modalhealth.hide();
  };

     $ionicModal.fromTemplateUrl('templates/junk.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modaljunk = modal;
  });
    $scope.closeJunk = function() {
    $scope.modaljunk.hide();
  };



 var  app = new Clarifai.App("1Ffauy_ESYjZNZ-OJwq_Mhz8FA0FE2GOoQnJ7lPR", "zMK86-UqeDCmvn440hH1OOI-huq-wAeh6zBqhoq7")
var answer;
$scope.mealType = {};
$scope.meal={}
    $scope.mealImage = null;

    $scope.processImage = () =>{
        encodeImageFileAsURL();
        $scope.mealType={};
    }


    function encodeImageFileAsURL() {
        var filesSelected = document.getElementById("inputFileToLoad").files;
        if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        var fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64

            var newImage = document.createElement('img');
            newImage.src = srcData;
            //$scope.meal.mealImage = srcData;

            document.getElementById("imagePreview").innerHTML = newImage.outerHTML;
            //alert("Converted Base64 version is " + document.getElementById("imagePreview").innerHTML);
            
            var base64ImageContent = srcData.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
          //  var blob = base64ToBlob(base64ImageContent, 'image/png');     
//console.log("Converted Base64 version is ", blob);

        app.models.predict("junkfoods", {base64: base64ImageContent}).then(
            function(response) {
              //answer = response
              //answer = response.outputs[0].data.concepts)[0].name
              console.log('getting response', response.outputs[0].data.concepts[0], 'fssfsdf',response.outputs[0].data.concepts[1]);
              $scope.mealType = response.outputs[0].data.concepts[0];
              if('health' == $scope.mealType.name) {
                 $scope.modalhealth.show();
              }
            if('junk' == $scope.mealType.name) {
                 $scope.modaljunk.show();
              }
              $scope.$apply();
              // return answer
            },
            function(err) {
              // there was an error
              console.log('here is the error', err);
            }
          );


        }
        fileReader.readAsDataURL(fileToLoad);
        }
    }


})

.controller('ChatsCtrl', function($scope, Chats, $http) {
$scope.currentLevel={};
$scope.nextLevel={};

      $http.get('https://disrupt-hack-api.herokuapp.com/api/v1/users/12345/matches')
    .success(function (data, status, headers, config) {
      console.log('datagetting back', data);
      $scope.currentLevel = data.current_level;
      $scope.nextLevel = data.next_level;

    }).error(function (data, status, headers, config) {
        console.log('There was a getting your information' + JSON.stringify(data) + JSON.stringify(status));
    });

$scope.$watch('level', function(value){
       $http.get('https://disrupt-hack-api.herokuapp.com/api/v1/users/12345/matches')
    .success(function (data, status, headers, config) {
      console.log('datagetting back', data);
      $scope.currentLevel = data.current_level;
      $scope.nextLevel = data.next_level;

    }).error(function (data, status, headers, config) {
        console.log('There was a getting your information' + JSON.stringify(data) + JSON.stringify(status));
    });
})

$scope.clicking = function() {
  
var request = { liked_user_id: 452346 };
      $http.post('https://disrupt-hack-api.herokuapp.com/api/v1/users/12345/like', request)
                .success(function (data, status, headers, config) {
                  console.log('getting level', JSON.stringify(data), JSON.stringify(status));
                 
        
                }).error(function (data, status, headers, config) {
                    console.log('There was a error' + JSON.stringify(data) + JSON.stringify(status));
                });

  //  alert('dada');
}

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

$scope.$watch('level', function(value){
          console.log('updating level', value);
          data.setValue(0, 1, value);
          chart.draw(data, options);
})
        // setInterval(function() {
        //   data.setValue(0, 1, 5);
        //   chart.draw(data, options);
        // }, 10000);

        
      }


});
