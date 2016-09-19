angular.module('myApp').factory('TeacherAuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create teacher variable
    var teacher = null;

    function registerTeacher(username, password, name, phone_number) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/teacher/register',
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
      if(teacher) {
        return true;
      } else {
        return false;
      }
    }

    function getTeacherStatus() {
      console.log('GETTING TEACHER STATUS');
      return $http.get('/teacher/status')
      // handle success
      .success(function (data) {
        if(data.status){
          console.log('TEACHER IS TRUE');
          teacher = true;
        } else {
          console.log('TEACHER IS FALSE BC: ' + data);
          teacher = false;
        }
      })
      // handle error
      .error(function (data) {
        console.log('TEACHER IS FALSE BC ERROR: ' + data);
        teacher = false;
      });
    }

    function loginToTeach(username, password) {

      // send a post request to the server
      return $http.post('/teacher/login',
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
      $http.get('/teacher/logout')
        // handle success
        .success(function (data) {
          teacher = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          teacher = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getTeacherStatus: getTeacherStatus,
      loginToTeach: loginToTeach,
      logout: logout,
      registerTeacher: registerTeacher
    }); 

}]);