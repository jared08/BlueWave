angular.module('myApp').controller('learnerLoginController',
  ['$rootScope', '$scope', '$location', 'LearnerAuthService',
  function ($rootScope, $scope, $location, LearnerAuthService) {
    
    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      LearnerAuthService.loginToLearn($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function (data) {          
          $rootScope.learner_id = data._id;          
          console.log('learner_id: ' + data._id);
          $location.path('/learner');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

angular.module('myApp').controller('learnerLogoutController',
  ['$scope', '$location', 'LearnerAuthService',
  function ($scope, $location, LearnerAuthService) {

    $scope.logout = function () {

      // call logout from service
      LearnerAuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}]);

angular.module('myApp').controller('learnerRegisterController',
  ['$scope', '$location', 'LearnerAuthService',
  function ($scope, $location, LearnerAuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      LearnerAuthService.registerLearner($scope.registerForm.username, $scope.registerForm.password, 
        $scope.registerForm.name, $scope.registerForm.phone_number)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);

angular.module('myApp').controller('learnerRequestController',
  ['$rootScope', '$scope', '$location', 'RequestService',
  function ($rootScope, $scope, $location, RequestService) {
    console.log('inside learner request controller');

    $scope.createRequest = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      console.log('$scope.request.topic: ' + $scope.request.topic);

      // call register from service
      RequestService.createRequest($rootScope.learner_id, $scope.request.question, $scope.request.topic, $scope.request.difficulty,
        $scope.request.contact_method)
        // handle success
        .then(function (data) {
          console.log('data: ' + data);
          $rootScope.request_id = data._id;
          $location.path('/learn');
          $scope.disabled = false;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });

    };

}]);

angular.module('myApp').controller('learnController',
  ['$rootScope', '$scope', '$location', 'LearnService', 'RequestService',
  function ($rootScope, $scope, $location, LearnService, RequestService) {

    var getMessages = function() {
      LearnService.getMessages($rootScope.request_id)
       // handle success
        .then(function (data) {
          var messages = data[0].messages;          
          for (i = 0; i < messages.length; i++) {
            if(messages[i].sender_id == $rootScope.learner_id) {
              messages[i].sender_name = 'Me';
            } 
          }
          $scope.messagelist = messages;
          $location.path('/learn');
          $scope.enabled = true;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
    };

    getMessages();

    $scope.refresh = function() {
      getMessages();
    }

    $scope.send = function () {
      LearnService.addMessage($rootScope.learner_id, $rootScope.request_id, $scope.content)
       // handle success
        .then(function () {
          $scope.content = '';
          $location.path('/learn');
          $scope.enabled = true;
          getMessages();
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
    };

    $scope.cancelRequest = function (request_id) {
      RequestService.cancelRequest($rootScope.learner_id, $rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.request_id = '';
          $location.path('/learner');
          $scope.disabled = false;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
    };

    $scope.finishRequest = function (request_id) {
      RequestService.finishRequest($rootScope.learner_id, $rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.request_id = '';
          $location.path('/learner');
          $scope.disabled = false;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });        
    };

}]);