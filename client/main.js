var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      access: {restricted: true}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'learnerLoginController',
      controller: 'teacherLoginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'learnerLogoutController',
      controller: 'teacherLogoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'learnerRegisterController',
      controller: 'teacherRegisterController',
      access: {restricted: false}
    })    
    .when('/teacher', {
      templateUrl: 'partials/teacher_home.html',
      controller: 'teacherRequestController',
      access: {restricted: true}
    })
    .when('/teacher_profile', {
      templateUrl: 'partials/teacher_profile.html',
      controller: 'teacherTopicController',
      access: {restricted: true}
    })  
    .when('/learner', {
      templateUrl: 'partials/learner_home.html',
      controller: 'learnerRequestController',
      access: {restricted: true}
    })
    .when('/teach', {
      templateUrl: 'partials/teach.html',
      controller: 'teachController',
      access: {restricted: true}
    })
    .when('/learn', {
      templateUrl: 'partials/learn.html',
      controller: 'learnController',
      access: {restricted: true}
    })
    .otherwise({
      redirectTo: '/'
    });    
});