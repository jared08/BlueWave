angular.module('myApp').factory('RequestService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {   

    function createRequest(learner_id, question, topic, difficulty, contact_method) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      console.log('topic: ' + topic);
      return $http.post('/request/createRequest',
        {learner_id: learner_id, question: question, topic: topic, difficulty: difficulty, contact_method: contact_method})
        // handle success
        .then(function(response) {
              console.log(response.data);
              return response.data;
            });

      // return promise object
      
      return deferred.promise;

    }

    function acceptRequest(teacher_id, request_id) {
      // create a new instance of deferred
      var deferred = $q.defer();

      console.log('trying to put: ' + teacher_id + ' and: ' + request_id);

      // send a post request to the server
      return $http.put('/request/acceptRequest',
        {teacher_id: teacher_id, request_id: request_id})
        .then(function(response) {
              console.log(response.data);
              return response.data;
            });

      // return promise object
      
      return deferred.promise;

    }

    function cancelRequest(teacher_id, request_id) {
      // create a new instance of deferred
      var deferred = $q.defer();

      console.log('trying to put: ' + teacher_id + ' and: ' + request_id);

      // send a post request to the server
      return $http.put('/request/cancelRequest',
        {teacher_id: teacher_id, request_id: request_id})
        .then(function(response) {
              console.log(response.data);
              return response.data;
            });

      // return promise object
      
      return deferred.promise;

    }

    function finishRequest(teacher_id, request_id) {
      // create a new instance of deferred
      var deferred = $q.defer();

      console.log('trying to put: ' + teacher_id + ' and: ' + request_id);

      // send a post request to the server
      return $http.put('/request/finishRequest',
        {teacher_id: teacher_id, request_id: request_id})
        .then(function(response) {
              console.log(response.data);
              return response.data;
            });

      // return promise object
      
      return deferred.promise;

    }

    function getRequestListForTopic(teacher_id) {

      var parameters = {
         teacher_id: teacher_id
      };

      return $http.get('/request/getRequestListForTopic',
        { params: parameters })
            .then(function(response) {
              return response.data;
            });
    }

    // return available functions for use in the controllers
    return ({
      createRequest: createRequest,
      cancelRequest: cancelRequest,
      finishRequest: finishRequest,
      getRequestListForTopic: getRequestListForTopic,
      acceptRequest: acceptRequest
    }); 

    

}]);