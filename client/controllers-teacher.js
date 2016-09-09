angular.module('myApp').controller('teacherLoginController',
  ['$rootScope', '$scope', '$location', 'TeacherAuthService',
  function ($rootScope, $scope, $location, TeacherAuthService) {
    
    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      TeacherAuthService.loginToTeach($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function (data) {

          $rootScope.teacher_id = data._id;

          $location.path('/teacher');
          $scope.disabled = false;
          $scope.loginForm = {};

          // $scope.teacher = TeacherStateService;

        })
        // handle error
        .catch(function () {
          console.log('err');
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

angular.module('myApp').controller('teacherLogoutController',
  ['$rootScope', '$scope', '$location', 'TeacherAuthService',
  function ($rootScope, $scope, $location, TeacherAuthService) {

    $scope.logout = function () {

      // call logout from service
      TeacherAuthService.logout()
        .then(function () {
          $location.path('/login');
        });
      $rootScope.teacher_id = '';

    };

}]);

angular.module('myApp').controller('teacherRegisterController',
  ['$scope', '$location', 'TeacherAuthService',
  function ($scope, $location, TeacherAuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      TeacherAuthService.registerTeacher($scope.registerForm.username, $scope.registerForm.password, 
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

angular.module('myApp').controller('teacherRequestController',
  ['$rootScope', '$scope', '$location', 'RequestService',
  function ($rootScope, $scope, $location, RequestService) {


    var refreshRequests = function() {

      RequestService.getRequestListForTopic($rootScope.teacher_id)
       // handle success
        .then(function (data) {
          $scope.requestlist = data;
          $location.path('/teacher');
          $scope.disabled = false;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
      };    

    refreshRequests();

    $scope.acceptRequest = function (request_id) {
      console.log('ACCEPTING REQUEST');
      RequestService.acceptRequest($rootScope.teacher_id, request_id)
       // handle success
        .then(function () {
          console.log('SETTING PATH TO TEACH');
          $rootScope.request_id = request_id;
          $location.path('/teach');
          $scope.disabled = false;
        })
        // handle error
        .catch(function () {
          console.log('ERR');
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
        console.log('END OF REQUEST SERVICE');
    };

}]);

angular.module('myApp').controller('teacherTopicController',
  ['$rootScope', '$scope', '$location', 'TeacherTopicService',
  function ($rootScope, $scope, $location, TeacherTopicService) {


    var refreshTopics = function() {
      console.log('refreshing requests!!');

      TeacherTopicService.getTopicList($rootScope.teacher_id)
       // handle success
        .then(function (data) {
          $scope.topiclist = data[0].topics;
          console.log('topiclist: ' + $scope.topiclist);
          $location.path('/teacher');
          $scope.disabled = false;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
      };    

    refreshTopics();

    $scope.addTopic = function () {

      // $scope.teacher = TeacherStateService;

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service      
      TeacherTopicService.addTopic($rootScope.teacher_id, $scope.topic.name, $scope.topic.experience)
        // handle success
        .then(function () {
          $location.path('/teacher');
          $scope.disabled = false;
          refreshTopics();
          $scope.topic = '';
          $scope.experience = '';
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
    };

    $scope.removeTopic = function (topic_name) {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      TeacherTopicService.removeTopic($rootScope.teacher_id, topic_name)
        // handle success
        .then(function () {
          $location.path('/teacher');
          $scope.disabled = false;
          refreshTopics();
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
    };

}]);

angular.module('myApp').controller('teachController',
  ['$rootScope', '$scope', '$location', 'TeachService', 'RequestService',
  function ($rootScope, $scope, $location, TeachService, RequestService) {

    var getMessages = function() {
      TeachService.getMessages($rootScope.request_id)
       // handle success
        .then(function (data) {
          var messages = data[0].messages;          
          for (i = 0; i < messages.length; i++) {
            if(messages[i].sender_id == $rootScope.teacher_id) {
              messages[i].sender_name = 'Me';
            } 
          }
          $scope.messagelist = messages;
          $location.path('/teach');
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
      TeachService.addMessage($rootScope.teacher_id, $rootScope.request_id, $scope.content)
       // handle success
        .then(function () {
          $scope.content = '';
          $location.path('/teach');
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

    var refreshRequests = function() {

      RequestService.getRequestListForTopic($rootScope.teacher_id)
       // handle success
        .then(function (data) {
          $scope.requestlist = data;
          $location.path('/teacher');
          $scope.disabled = false;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
      };

    $scope.cancelRequest = function (request_id) {
      RequestService.cancelRequest($rootScope.teacher_id, $rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.request_id = '';
          $location.path('/teacher');
          $scope.disabled = false;
          refreshRequests();
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
    };

    $scope.finishRequest = function (request_id) {
      RequestService.finishRequest($rootScope.teacher_id, $rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.request_id = '';
          $location.path('/teacher');
          $scope.disabled = false;
          refreshRequests();
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });        
    };

}]);
