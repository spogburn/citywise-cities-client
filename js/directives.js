'use strict';

app.directive('navDisplay', function(){
  return {
    restrict: 'E',
    templateUrl: '../templates/nav.html',
    controller: 'LoginController as LC'
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

app.directive('fixedList', function(){
  return {
    restrict: 'E',
    templateUrl: '../templates/fixedlist.html'
  }
})

app.directive('archivedList', function(){
  return {
    restrict: 'E',
    templateUrl: '../templates/archivedlist.html'
  }
})
app.directive('routeLoadingIndicator', function($rootScope) {
  return {
  restrict: 'E',
  template: "<div ng-show='isRouteLoading' class='loading-indicator'>" +
  "<div class='loading-indicator-body'>" +
  "<h3 class='loading-title'>Loading...</h3>" +
  "<div class='spinner'><chasing-dots-spinner></chasing-dots-spinner></div>" +
  "</div>" +
  "</div>",
  replace: true,
  link: function(scope, elem, attrs) {
    scope.isRouteLoading = false;

    $rootScope.$on('$routeChangeStart', function() {
      console.log('route loading');
      scope.isRouteLoading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function() {
      console.log('route loaded');
      scope.isRouteLoading = false;
    });
  }
};
});
