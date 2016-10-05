angular.module('myApp').factory('TeacherTopicService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {   

    function addTopic(teacher_id, topic_name, topic_experience, topic_description) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/teacher/topic/addTopic',
        {teacher_id: teacher_id, topic: topic_name, experience: topic_experience, description: topic_description})
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

    function removeTopic(teacher_id, topic_name) {
      // create a new instance of deferred
      var deferred = $q.defer();

      var parameters = {
         teacher_id: teacher_id,
         topic: topic_name
      };

      // send a post request to the server
      $http.delete('/teacher/topic/removeTopic',
        { params: parameters })
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

    function getTopicList(teacher_id) {

      var parameters = {
         teacher_id: teacher_id
      };

      return $http.get('/teacher/topic/getTopicList',
        { params: parameters })
            .then(function(response) {
              return response.data;
            });
    }

    // return available functions for use in the controllers
    return ({
      addTopic: addTopic,
      removeTopic: removeTopic,
      getTopicList: getTopicList
    }); 

}]);