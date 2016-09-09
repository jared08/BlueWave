angular.module('myApp').factory('LearnerAuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create learner variable
    var learner = null;

    function registerLearner(username, password, name, phone_number) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/learner/register',
        {username: username, password: password, name: name, phone_number: phone_number})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function isLoggedIn() {
      if(learner) {
        return true;
      } else {
        return false;
      }
    }

    function getLearnerStatus() {
      return $http.get('/learner/status')
      // handle success
      .success(function (data) {
        if(data.status){
          learner = true;
        } else {
          learner = false;
        }
      })
      // handle error
      .error(function (data) {
        learner = false;
      });
    }

    function loginToLearn(username, password) {

      // send a post request to the server
      return $http.post('/learner/login',
        {username: username, password: password})
        // handle success
        .then(function(response) {
            return response.data;
        });

    }

    function logout() {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/learner/logout')
        // handle success
        .success(function (data) {
          learner = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          learner = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getLearnerStatus: getLearnerStatus,
      loginToLearn: loginToLearn,
      logout: logout,
      registerLearner: registerLearner
    }); 

}]);