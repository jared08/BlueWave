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

angular.module('myApp').directive('myModal', function() {
   return {
     restrict: 'A',
     link: function(scope, element, attr) {
       scope.dismiss = function() {
           element.modal('hide');
       };
     }
   } 
});

angular.module('myApp').controller('teacherRequestController',
  ['$rootScope', '$scope', '$location', '$timeout', 'RequestService',
  function ($rootScope, $scope, $location, $timeout, RequestService) {

    var stop = false;

    var refreshRequests = function() {

      RequestService.getRequestListForTopic($rootScope.teacher_id)
       // handle success
        .then(function (data) {
          $scope.requestlist = data;

          for (var i = 0; i < data.length; i++) {           

            var date1 = new Date(data[i].create_time);
            var date2 = new Date();

            var diff = ((date2 - date1) / 1000).toString();

            var time;
            if (diff < 60) {
              time = Math.round((diff / 1)) + ' seconds';
            } else if (diff < 3600) {
              time = Math.round((diff / 60)) + ' minutes';
            } else if (diff < 86400) {
              time = Math.round((diff / 3600)) + ' hours';
            } else if (diff < 604800) {
              time = Math.round((diff / 86400)) + ' days';
            } else if (diff < 31449600) {
              time = Math.round((diff / 604800)) + ' weeks';
            } else {
              time = Math.round((diff / 31449600)) + ' years';
            }
            $scope.requestlist[i].time = time;
          }


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

    $scope.refresh = function () {
      refreshRequests();
    };


    $scope.acceptRequest = function (request_id) {
      RequestService.acceptRequest($rootScope.teacher_id, request_id)
       // handle success
        .then(function () {
          stop = false;
          $rootScope.request_id = request_id;
          refreshSingleRequest();
          // $location.path('/teach');
          $scope.disabled = false;
        })
        // handle error
        .catch(function () {
          console.log('ERR');
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
    };

    var refreshSingleRequest = function() {
       $timeout(function() {

        RequestService.getRequestInfo($rootScope.request_id)
         // handle success
          .then(function (data) {
            console.log('DATA FROM SINGLE REQUEST: ' + data[0].state);
            console.log('STOP: ' + stop);
              if (!stop) {
                if(data[0].state == 'in_progress') {
                  console.log('they accepted!!');
                  $('.modal').modal('hide');
                  $location.path('/teach');
                } else {
                  console.log('still waiting..');
                  refreshSingleRequest();
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

      $scope.cancelRequest = function () {
      RequestService.cancelRequest($rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.request_id = '';
          stop = true;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
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

          for (var i = 0; i < data[0].topics.length; i++) {
            if ($scope.topiclist[i].num_classes == 0) {
              $scope.topiclist[i].rating = '--';
              $scope.topiclist[i].num_classes = '--';
            } else {
              $scope.topiclist[i].rating = data[0].topics[i].rating.toFixed(1);
            }
            
          }          

          console.log('topiclist: ' + $scope.topiclist);
          $location.path('/teacher_profile');
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
          $location.path('/teacher_profile');
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
          $location.path('/teacher_profile');
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
  ['$rootScope', '$scope', '$location', '$timeout', 'TeachService', 'RequestService',
  function ($rootScope, $scope, $location, $timeout, TeachService, RequestService) {

    var from_send = false;
    var stop = false;

    var getMessages = function() {
      console.log('calling get messages!!');
      
        console.log('inside timeout function');
        TeachService.getMessages($rootScope.request_id)
         // handle success
          .then(function (data) {
            console.log('inside callback');
            if (!stop) {
              if (data[0].state == 'cancelled') {
                $('#cancelledModal').modal('show');
              } else if (data[0].state == 'finished') {
                $('#finishedModal').modal('show');
              } else {
                var messages = data[0].messages;          
                for (i = 0; i < messages.length; i++) {
                  if(messages[i].sender_id == $rootScope.teacher_id) {
                    messages[i].sender_name = 'Me';
                  } 
                }
                $scope.messagelist = messages;              
                $scope.enabled = true;    
                if (!from_send) {
                  refresh();
                }               
              }
            }
            
          })
          // handle error
          .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
          });

    };

    getMessages();

    var refresh = function() {
      $timeout(function() {
        from_send = false;
        getMessages();
      }, 3000)
    }

    $scope.send = function () {
      TeachService.addMessage($rootScope.teacher_id, $rootScope.request_id, $scope.content)
       // handle success
        .then(function () {
          $scope.content = '';
          $location.path('/teach');
          $scope.enabled = true;
          from_send = true;
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

     $scope.keepTeaching = function() {
      $location.path('/teacher');
      $('.modal').modal('hide');
    }

    $scope.cancelRequest = function (path) {
      RequestService.cancelRequest($rootScope.teacher_id, $rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.request_id = '';
          stop = true;
          if (path == 1) {
            $location.path('/teacher');
            refreshRequests();
          } else if (path == 2) {
            $location.path('/teacher_profile');
          } else if (path == 3) {
            $location.path('login');
          }          
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
          stop = true;
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

angular.module('myApp').controller('teacherProfileController',
  ['$rootScope', '$scope', '$location', 'RequestService',
  function ($rootScope, $scope, $location, RequestService) {

  var getRequests = function() {
      RequestService.getRequests($rootScope.teacher_id)
       // handle success
        .then(function (data) {
          $scope.requestlist = data;

          for (var i = 0; i < data.length; i++) {            

            var date1 = new Date(data[i].start_time);
            var date2 = new Date(data[i].end_time);

            var diff = ((date2 - date1) / 1000).toString();

            var time;
            if (diff < 60) {
              time = Math.round((diff / 1)) + ' seconds';
            } else if (diff < 3600) {
              time = Math.round((diff / 60)) + ' minutes';
            } else if (diff < 86400) {
              time = Math.round((diff / 3600)) + ' hours';
            } else if (diff < 604800) {
              time = Math.round((diff / 86400)) + ' days';
            } else if (diff < 31449600) {
              time = Math.round((diff / 604800)) + ' weeks';
            } else {
              time = Math.round((diff / 31449600)) + ' years';
            }
            $scope.requestlist[i].time = time;
          }
          $scope.enabled = true;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });
    };


  getRequests();

  $scope.setMessages = function (request) {
    var index = $scope.requestlist.indexOf(request);
    console.log('index: ' + index);

    var messages = $scope.requestlist[index].messages;       
    for (i = 0; i < messages.length; i++) {
      if(messages[i].sender_id == $rootScope.teacher_id) {
        messages[i].sender_name = 'Me';
      } 
    }
    $scope.messagelist = messages;
  }

   $scope.setComments = function (request) {
    $scope.comments = request.comments;
  }

}]);
