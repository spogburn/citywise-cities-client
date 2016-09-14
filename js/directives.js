'use strict';

app.directive('navDisplay', function(){
  return {
    restrict: 'E',
    templateUrl: '../templates/nav.html',
  };
});

app.directive('signIn', function(){
  return {
    restrict: 'E',
    templateUrl: '../templates/signin.html',
  };
});

app.directive('wiseUpCard', function(){
  return {
    restrict: 'E',
    templateUrl: '../templates/card.html'
  }
})

app.directive('wiseUpList', function(){
  return {
    restrict: 'E',
    templateUrl: '../templates/list.html'
  }
})

app.directive('largeList', function(){
  return {
    restrict: 'E',
    templateUrl: '../templates/largelist.html'
  }
})

app.directive('routeLoadingIndicator', function($rootScope) {
  return {
    restrict: 'E',
    template: "<h1 ng-show='isRouteLoading'>Loading...</h1>",
    replace: true,
    link: function(scope, elem, attrs) {
      scope.isRouteLoading = false;
      console.log(scope.isRouteLoading);
      $rootScope.$on('$routeChangeStart', function() {
        scope.isRouteLoading = true;
        console.log(scope.isRouteLoading);
      });
      $rootScope.$on('$routeChangeSuccess', function() {
        scope.isRouteLoading = false;
        console.log(scope.isRouteLoading);
      });
    }
  };
});
