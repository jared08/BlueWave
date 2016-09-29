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

    function getRequestInfo(request_id) {

      var parameters = {
         request_id: request_id
      };

      return $http.get('/request/getRequestInfo',
        { params: parameters })
            .then(function(response) {
              return response.data;
            });
    }

    function getTeacherInfo(teacher_id) {

      var parameters = {
         teacher_id: teacher_id
      };

      return $http.get('/request/getTeacherInfo',
        { params: parameters })
            .then(function(response) {
              return response.data;
            });
    }

    function getTeacherTopicInfo(teacher_id, topic) {

      var parameters = {
         teacher_id: teacher_id,
         topic: topic
      };

      return $http.get('/request/getTeacherTopicInfo',
        { params: parameters })
            .then(function(response) {
              return response.data;
            });
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

    function acceptTeacher(request_id, learner_id, question) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      return $http.put('/request/acceptTeacher',
        {request_id: request_id, learner_id: learner_id, question: question})
        .then(function(response) {
              console.log(response.data);
              return response.data;
            });

      // return promise object
      
      return deferred.promise;

    }




    function rejectTeacher(request_id) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      return $http.put('/request/rejectTeacher',
        {request_id: request_id})
        .then(function(response) {
              console.log(response.data);
              return response.data;
            });

      // return promise object
      
      return deferred.promise;

    }


    function cancelRequest(request_id) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      return $http.put('/request/cancelRequest',
        {request_id: request_id})
        .then(function(response) {
              console.log(response.data);
              return response.data;
            });

      // return promise object
      
      return deferred.promise;

    }

    function finishRequest(request_id, teacher_rating, understanding, teacher_id, topic, comments) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      return $http.put('/request/finishRequest',
        {request_id: request_id, teacher_rating: teacher_rating, understanding: understanding,
          teacher_id: teacher_id, topic: topic, comments: comments})
        .then(function(response) {
              console.log(response.data);
              return response.data;
            });

      // return promise object
      
      return deferred.promise;

    }

    function getRequestListForTopic(teacher_id) {
      console.log('getting request list for: ' + teacher_id);

      var parameters = {
         teacher_id: teacher_id
      };

      return $http.get('/request/getRequestListForTopic',
        { params: parameters })
            .then(function(response) {
              console.log('TOPIC RESPONSE: ' + response.data);
              return response.data;
            });
    }

    function getRequests(user_id) {

      //user_id b/c both teacher and learner can call this function
      var parameters = {
        user_id: user_id
      };

      return $http.get('/request/getRequests',
        { params: parameters })
            .then(function(response) {
              console.log('response.data: ' + response.data);
              return response.data;
            });
    }

    // return available functions for use in the controllers
    return ({
      createRequest: createRequest,
      getRequestInfo: getRequestInfo,
      getTeacherInfo: getTeacherInfo,
      getTeacherTopicInfo: getTeacherTopicInfo,
      acceptRequest: acceptRequest,
      acceptTeacher: acceptTeacher,
      rejectTeacher: rejectTeacher,
      cancelRequest: cancelRequest,
      finishRequest: finishRequest,
      getRequestListForTopic: getRequestListForTopic,
      getRequests: getRequests
      
    }); 

    

}]);