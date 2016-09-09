angular.module('myApp').factory('LearnService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {   

    function getMessages(request_id) {

      var parameters = {
         request_id: request_id
      };

      return $http.get('/request/message/getMessages',
        { params: parameters })
            .then(function(response) {
              return response.data;
            });
    }

    function addMessage(learner_id, request_id, content) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/request/message/addMessageLearner',
        {learner_id: learner_id, request_id: request_id, content: content})
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



    // return available functions for use in the controllers
    return ({
      getMessages: getMessages,
      addMessage: addMessage
    }); 

    

}]);