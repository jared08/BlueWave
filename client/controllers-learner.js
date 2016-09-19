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
  ['$rootScope', '$scope', '$timeout', '$location', 'RequestService',
  function ($rootScope, $scope, $timeout, $location, RequestService) {
    console.log('inside learner request controller');

    $scope.request = {};
    $scope.request.difficulty = 'Medium';
    $scope.request.contact_method = 'Chat';
    $scope.request.isChecked1 = true;
    $scope.request.isChecked2 = true;
    $scope.disable_button = true;

    var stop;

    

    $scope.createRequest = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      $scope.disable_button = true;

      //needs this to stop loop of looking for a teacher if someone hits cancel
      stop = false;

      // call register from service
      RequestService.createRequest($rootScope.learner_id, $scope.request.question, $scope.request.topic, $scope.request.difficulty,
        $scope.request.contact_method)
        // handle success
        .then(function (data) {

          console.log('data: ' + data);
          $rootScope.request_id = data._id;
          $scope.request = data;
          $scope.request.header = 'Trying to find you a teacher..';
          $location.path('/learner');
          $scope.disabled = false;
          refreshRequest();
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });

    };

     var refreshRequest = function() {
      $timeout(function() {

        RequestService.getRequestInfo($rootScope.request_id)
         // handle success
          .then(function (data) {
            console.log('STOP: ' + stop);
            if (!stop) {
              if(data[0].teacher_id) {
                console.log('found a teacher!!!');
                $rootScope.teacher_id = data[0].teacher_id;
                getTeacher();
              } else {
                console.log('still looking for a teacher..');
                refreshRequest();
              }
            }
          })
          // handle error
          .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
          });
        }, 3000)
      };  

    var getTeacher = function() {

        RequestService.getTeacherInfo($rootScope.teacher_id)
         // handle success
          .then(function (data) {
            $scope.request.teacher = data[0];
            $scope.request.header = 'We found you a teacher!';
            getTeacherTopicInfo(data[0]);
          })
          // handle error
          .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
          });
      }; 

    var getTeacherTopicInfo = function() {

        RequestService.getTeacherTopicInfo($rootScope.teacher_id, $scope.request.topic)
         // handle success
          .then(function (data) {
            console.log('data: ' + data);
            $scope.request.topic_info = data;
            $scope.request.teacher.info = $scope.request.teacher.name + ' -- ' + $scope.request.topic_info.experience + 
              ' years of experience with ' + $scope.request.topic;
            $scope.disable_button = false;
          })
          // handle error
          .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
          });
      };     

    $scope.rejectTeacher = function () {
      RequestService.rejectTeacher($rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.teacher_id = '';
          $scope.request.topic_info = '';
          $scope.request.header = 'Trying to find you another teacher...';
          $scope.request.teacher = '';
          $scope.disable_button = true;
          refreshRequest();
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
    }; 

    $scope.acceptTeacher = function() {
      RequestService.acceptTeacher($rootScope.request_id, $rootScope.learner_id, $scope.request.question)
       // handle success
        .then(function () {
          stop = true;      
          $location.path('/learn');
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
      
    }

    $scope.deleteRequest = function () {
      RequestService.deleteRequest($rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.request_id = '';
          $rootScope.teacher_id = '';
          $scope.request = {};

          $scope.request.difficulty = 'Medium';
          $scope.request.contact_method = 'Chat';
          $scope.request.isChecked1 = true;
          $scope.request.isChecked2 = true;

          console.log('SETTING STOP TO TRUE');
          stop = true;
          
          $location.path('/learner');
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

    $scope.deleteRequest = function () {
      RequestService.deleteRequest($rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.request_id = '';
          $rootScope.teacher_id = '';
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
      RequestService.finishRequest($rootScope.request_id)
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