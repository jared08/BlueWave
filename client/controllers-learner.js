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
          $rootScope.learner_name = data.name;     
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

    $scope.request = {};

    $scope.image_1 = 'partials/images/math.png'
    $scope.image_2 = 'partials/images/finance.png'
    $scope.image_3 = 'partials/images/technology.png'
    $scope.image_4 = 'partials/images/health.png'
    $scope.image_5 = 'partials/images/science.png'
    $scope.image_6 = 'partials/images/sports.png'
    $scope.image_7 = 'partials/images/cars.png'
    $scope.image_8 = 'partials/images/travel.png'
    $scope.image_9 = 'partials/images/business.png'
    $scope.image_10 = 'partials/images/fitness.png';
    $scope.image_11 = 'partials/images/music.png';
    $scope.image_12 = 'partials/images/other.png';    

    $scope.request.difficulty = 'Medium';
    $scope.request.contact_method = 'Chat';
    $scope.request.isChecked1 = true;
    $scope.request.isChecked2 = true;
    $scope.disable_button = true;

    var initializeOpacities = function() {
      $scope.opacity_1 = 1;
      $scope.opacity_2= 1;
      $scope.opacity_3 = 1;
      $scope.opacity_4 = 1;
      $scope.opacity_5 = 1;
      $scope.opacity_6 = 1;
      $scope.opacity_7 = 1;
      $scope.opacity_8 = 1;
      $scope.opacity_9 = 1;
      $scope.opacity_10 = 1;
      $scope.opacity_11 = 1;
      $scope.opacity_12 = 1;
    }

    initializeOpacities();

    var stop_looking, stop_teacher;

    $scope.highlight = function (index) {
      if (index == 1) {
        $scope.request.topic = 'Math';  
        initializeOpacities();     
        $scope.opacity_1 = 0.3;
      } else if (index == 2) {
        $scope.request.topic = 'Finance';
        initializeOpacities();
        $scope.opacity_2 = 0.3;
      } else if (index == 3) {
        $scope.request.topic = 'Technology';
        initializeOpacities();
        $scope.opacity_3 = 0.3;
      } else if (index == 4) {
        $scope.request.topic = 'Health';
        initializeOpacities();
        $scope.opacity_4 = 0.3;
      } else if (index == 5) {
        $scope.request.topic = 'Science';
        initializeOpacities();
        $scope.opacity_5 = 0.3;
      } else if (index == 6) {
        $scope.request.topic = 'Sports';
        initializeOpacities();
        $scope.opacity_6 = 0.3;
      } else if (index == 7) {
        $scope.request.topic = 'Cars';
        initializeOpacities();
        $scope.opacity_7 = 0.3;
      } else if (index == 8) {
        $scope.request.topic = 'Travel';
        initializeOpacities();
        $scope.opacity_8 = 0.3;
      } else if (index == 9) {
        $scope.request.topic = 'Business';
        initializeOpacities();
        $scope.opacity_9 = 0.3;
      } else if (index == 10) {
        $scope.request.topic = 'Fitness';
        initializeOpacities();
        $scope.opacity_10 = 0.3;
      } else if (index == 11) {
        $scope.request.topic = 'Music';
        initializeOpacities();
        $scope.opacity_11 = 0.3;
      } else if (index == 12) {
        $scope.request.topic = 'Other';
        initializeOpacities();
        $scope.opacity_12 = 0.3;
      }
    }

    $scope.submitOther = function() {
      if ($scope.other) {
        console.log($scope.other);
        //do something with other
        $scope.other = '';
      }     
    }

    $scope.submit = function () {
      if ($scope.request.contact_method == 'Chat') {
        $('#chatModal').modal('show');
        createRequest();
      } else {
        $('#emailModal').modal('show');
      }
    }

    $scope.sendEmail = function () {
      //TBD -- not sure if it should be an email or like an offline chat
    }

    var createRequest = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;
      $scope.image = '//:0';

      $scope.disable_button = true;

      //needs this to stop loop of looking for a teacher if someone hits cancel
      stop_looking = false;

      // call register from service
      RequestService.createRequest($rootScope.learner_id, $scope.request.question, $scope.request.topic, $scope.request.difficulty,
        $scope.request.contact_method)
        // handle success
        .then(function (data) {

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
            if (!stop_looking) {
              if(data[0].teacher_id) {
                console.log('found a teacher!!!');
                $rootScope.teacher_id = data[0].teacher_id;
                $rootScope.topic = data[0].topic;
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
            $scope.request.topic_info = data;
            $scope.request.teacher.info = $scope.request.teacher.name + ' -- ' + $scope.request.topic_info.experience + 
              ' of experience with ' + $scope.request.topic + ' -- ' + $scope.request.topic_info.description;
            if ($scope.request.topic_info.num_classes == 0) {
              $scope.request.teacher.info_rating = 'No ratings..';
              $scope.request.teacher.info_num_classes = '';
            } else {
              $scope.request.teacher.info_rating = $scope.request.topic_info.rating.toFixed(1);
              if ($scope.request.topic_info.rating > 4.7) {
                $scope.image = 'partials/images/5-star.png';
              } else if ($scope.request.topic_info.rating > 4.2) {
                $scope.image = 'partials/images/4.5-star.png';
              } else if ($scope.request.topic_info.rating > 3.7) {
                $scope.image = 'partials/images/4-star.png';
              } else if ($scope.request.topic_info.rating > 3.2) {
                $scope.image = 'partials/images/3.5-star.png';
              } else if ($scope.request.topic_info.rating > 2.7) {
                $scope.image = 'partials/images/3-star.png';
              } else if ($scope.request.topic_info.rating > 2.2) {
                $scope.image = 'partials/images/2.5-star.png';
              } else if ($scope.request.topic_info.rating > 1.7) {
                $scope.image = 'partials/images/2-star.png';
              } else if ($scope.request.topic_info.rating > 1.2) {
                $scope.image = 'partials/images/1.5-star.png';
              } else if ($scope.request.topic_info.rating > 0.7) {
                $scope.image = 'partials/images/1-star.png';
              } else {
                $scope.image = '//:0';
              }
              
              $scope.request.teacher.info_num_classes = ' (' + $scope.request.topic_info.num_classes + ')';
              checkTeacherStillThere();
              stop_teacher = false;
            }
            
            $scope.disable_button = false;
          })
          // handle error
          .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
          });
      };     

      var checkTeacherStillThere = function() {
      $timeout(function() {
        RequestService.getRequestInfo($rootScope.request_id)
         // handle success
          .then(function (data) {
            if (!stop_teacher) {
              if(data[0].teacher_id) {
                console.log('Teacher still here!');
                checkTeacherStillThere();
              } else {
                console.log('teacher left...');

                $rootScope.teacher_id = '';
                $rootScope.topic = '';
                $scope.request.topic_info = '';
                $scope.image = '//:0';
                $scope.request.header = 'Your teacher left..trying to find you another teacher...';
                $scope.request.teacher = '';
                stop_teacher = true;
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

    $scope.rejectTeacher = function () {
      RequestService.rejectTeacher($rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.teacher_id = '';
          $rootScope.topic = '';
          $scope.request.topic_info = '';
          $scope.image = '//:0';
          $scope.request.header = 'Trying to find you another teacher...';
          $scope.request.teacher = '';
          $scope.disable_button = true;
          stop_teacher = true;
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
          stop_teacher = true; 
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
          $rootScope.topic = '';
          $scope.request = {};

          $scope.request.difficulty = 'Medium';
          $scope.request.contact_method = 'Chat';
          $scope.request.isChecked1 = true;
          $scope.request.isChecked2 = true;

          stop_looking = true;
          stop_teacher = true;
          
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
  ['$rootScope', '$scope', '$location', '$timeout', 'LearnService', 'RequestService',
  function ($rootScope, $scope, $location, $timeout, LearnService, RequestService) {

    var from_send = false;
    var stop = false;  

    var getMessages = function() {
        LearnService.getMessages($rootScope.request_id)
         // handle success
          .then(function (data) {
            if (data[0]) {
              if (data[0].state == 'cancelled') {
                  $('#cancelModal').modal('show');
                } else if (data[0].state == 'finished') {
                  $('#finishModal').modal('show');
                } else {
                var messages = data[0].messages;          
                for (i = 0; i < messages.length; i++) {
                  if(messages[i].sender_id == $rootScope.learner_id) {
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
      if (!stop) {
        $timeout(function() {
          from_send = false;          
          getMessages();
        }, 3000)
      }
    }

    $scope.send = function () {
      LearnService.addMessage($rootScope.learner_id, $rootScope.request_id, $scope.content)
       // handle success
        .then(function () {
          $scope.content = '';
          $location.path('/learn');
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

    $scope.keepLearning = function() {
      $location.path('/learner');
      $('.modal').modal('hide');
    }

    $scope.cancelRequest = function (path) {
      RequestService.cancelRequest($rootScope.request_id)
       // handle success
        .then(function () {
          $rootScope.request_id = '';
          $rootScope.teacher_id = '';
          $rootScope.topic = '';
          stop = true;
          if (path == 1) {
            $location.path('/learner');
          } else if (path == 2) {
            $location.path('/learner_profile');
          } else if (path == 3) {
            $location.path('login');
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

    $scope.finishRequest = function () {

      var comments = '';

      if ($scope.comments) {
        comments = $scope.comments.text;
      }

      RequestService.finishRequest($rootScope.request_id, $scope.request.teacher_rating, $scope.request.understanding,
        $rootScope.teacher_id, $rootScope.topic, comments)
       // handle success
        .then(function () {
          $rootScope.request_id = '';
          stop = true;
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



angular.module('myApp').controller('learnerProfileController',
  ['$rootScope', '$scope', '$location', 'RequestService',
  function ($rootScope, $scope, $location, RequestService) {

  var getRequests = function() {
      RequestService.getRequests($rootScope.learner_id)
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

    var messages = $scope.requestlist[index].messages;       
    for (i = 0; i < messages.length; i++) {
      if(messages[i].sender_id == $rootScope.learner_id) {
        messages[i].sender_name = 'Me';
      } 
    }
    $scope.messagelist = messages;
  }

  $scope.setComments = function (request) {
    $scope.comments = request.comments;
  }

}]);