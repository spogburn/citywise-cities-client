'use strict';

app.controller('LoginController', ['$http', '$window', '$location', 'addCityService', function($http, $window, $location, acs){
  console.log('hello login');
  var vm = this;
  vm.place = null;
  vm.signinInfo = {};
  vm.error = {};

  vm.submit = function(){
    acs.signin(vm.signinInfo)
    .then(function(data){
        console.log('data', data);
      if (data.data.error){
        vm.error.message = 'You seem to have typed in the wrong email or password. Maybe you want to try again';
        vm.error.show = true;
      } else {
        console.log('data', data.data.user);
        $window.localStorage.token = data.data.token;
        $window.localStorage.email = data.data.user.admin_email;
        $window.localStorage.username = data.data.user.name;
        $window.localStorage.city_id = data.data.user.city_id;
        console.log('clientside', data);
        $location.path('/dashboard');
      }
    })
    .catch(function(err){
      console.log(err);
    });
  };

}])

app.controller('DashboardController', ['$http', '$window', 'ModalService', '$q', 'getCityData', function($http, $window, ModalService, $q, getCityData){
  var vm = this;
  vm.wiseups = [];
  vm.showLarge = false;
  vm.username = $window.localStorage.username;
  vm.currentDate = new Date()
  vm.getCityData = getCityData.getData()
    .then(function(data){
      console.log('data', data);
      vm.wiseups = data.data;
    })
    .catch(function(err){
      console.log(err);
    })
  vm.sortType = 'created_at';
  vm.sortReverse = false;
  vm.searchWiseups = '';
  vm.showIssue = function(item){
    console.log('showIssue');
  }

  vm.showImageModal = function(item) {
   // Just provide a template url, a controller and call 'showModal'.
   ModalService.showModal({
     templateUrl: "./templates/imagemodal.html",
     controller: function($scope, close) {
      $scope.item = item;
      $scope.dismissModal = function() {
         close(200); // close, but give 200ms for bootstrap to animate
        };
      }
    })
    .then(function(modal) {
     console.log('this is the modal item', item);
     console.log(modal);
     // The modal object has the element built, if this is a bootstrap modal
     // you can call 'modal' to show it, if it's a custom modal just show or hide
     // it as you need to.
     modal.element.modal();
     modal.close.then(function(){
      });
   });

 };
}])

app.controller('MapController', ['getMapService', function(getMapService){
  var vm = this;
  vm.getData = getMapService.getData();


}])
