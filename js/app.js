'use strict';

var app = angular.module('CityWiseAdmin', ['ngRoute', 'google.places', 'angularMoment', 'angular-spinkit', 'angularModalService']);

app.config(function($routeProvider){
  $routeProvider
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
  .otherwise({
    templateUrl: './views/login.html',
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
