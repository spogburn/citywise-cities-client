'use strict';

var app = angular.module('CityWiseAdmin', ['ngRoute', 'angularMoment',  'angularModalService']);

app.config(function($routeProvider){
  $routeProvider
  .when('/signin', {
    templateUrl: './views/signin.html',
    controller: 'LoginController as LC'
  })
  .when('/signup', {
    templateUrl: './views/signup.html',
  })
  .when('/about', {
    templateUrl: './views/about.html'
  })
  .when('/dashboard', {
    templateUrl: './views/dashboard.html',
    controller: 'DashboardController as DC'
  })
  .when('/card', {
    templateUrl: './views/card.html',
    controller: 'DashboardController as DC'
  })
  .when('/map', {
    templateUrl: './views/map.html',
    controller: 'MapController as MC'
  })
  .when('/fixed', {
    templateUrl: './views/fixed.html',
    controller: 'DashboardController as DC'
  })
  .when('/archived', {
    templateUrl: './views/archived.html',
    controller: 'DashboardController as DC'
  })
  .otherwise({
    templateUrl: './views/landing.html',
    controller: 'LoginController as LC'
  });
});

app.factory('authInterceptor', ['$q', '$window', function ($q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.localStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
}]);

app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}]);
