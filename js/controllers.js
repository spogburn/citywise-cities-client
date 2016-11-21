'use strict';

app.controller('LoginController', ['$http', '$window', '$location', 'loginService', '$scope', '$rootScope', function($http, $window, $location, ls, $scope, $rootScope){
  console.log('location', $location.path());
  var vm = this;

  vm.place = null;
  vm.signinInfo = {};
  vm.error = {};

  vm.submit = function(){
    ls.signin(vm.signinInfo)
    .then(function(data){
      console.log(data.data.error);
      if (data.data.error){
        vm.error.message = 'You seem to have typed in the wrong email or password. Maybe you want to try again';
        vm.error.show = true;
      } else {
        $window.localStorage.token = data.data.token;
        $window.localStorage.email = data.data.user.admin_email;
        $window.localStorage.username = data.data.user.name;
        $window.localStorage.city_id = data.data.user.city_id;
        $location.path('/dashboard');
      }
    })
    .catch(function(err){
      vm.error.message = err.data.error;
      vm.error.show = true;
    });
  };

  vm.logout = function(){
    $window.localStorage.clear();
    $location.path('/');
  };

}]);

app.controller('DashboardController', ['$http', '$window', '$uibModal', '$q', 'getCityData', 'updateCityData', 'sortDataService', '$location', '$scope', 'cityAnalyticsService', '$timeout', function($http, $window, $uibModal, $q, getCityData, updateCityData, sortDataService, $location, $scope, cityAnalyticsService, $timeout){

  $scope.pageClass = 'slide';
  var vm = this;
  vm.wiseups = getCityData.wiseups;
  vm.filtered = '';
  vm.username = $window.localStorage.username;
  vm.currentDate = Date.now();
  vm.sortType = 'created_at';
  vm.sortReverse = true;
  vm.searchWiseups = '';

  getCityData.getAllTheData();

  vm.showIssue = function(item){
    console.log('showIssue');
  }

  vm.filterByCategory = function(filter){
    sortDataService.filterByCategory(filter, vm.wiseups.current)
  }

  vm.categoryCounter = getCityData.categoryCounter;

  vm.categoryLabels = ['Utilities', 'Parks', 'Transit', 'Roads'];

  vm.categoryColors = getCityData.categoryColors;

  vm.categoryOptions = getCityData.categoryOptions;

  vm.statusData = getCityData.statusData;

  vm.statusLabels = ['Current', 'Fixed', 'Archived'];

  vm.showImageModal = function(item) {
    var modalInstance = $uibModal.open({
      templateUrl: "./templates/itemmodal.html",
      controller: 'modalController as ModC',
      size: 'lg',
      animation: false,
      resolve: {
        item: function () {
          return item;
            }
          }
        });
      }

  vm.showFixedModal = function(item) {
    var modalInstance = $uibModal.open({
      templateUrl: "./templates/fixedmodal.html",
      controller: 'modalController as ModC',
      size: 'lg',
      animation: false,
      resolve: {
        item: function () {
          return item;
            }
          }
        });
      }

    vm.showArchivedModal = function(item) {
      var modalInstance = $uibModal.open({
        templateUrl: "./templates/archivedmodal.html",
        controller: 'modalController as ModC',
        size: 'lg',
        animation: false,
        resolve: {
          item: function () {
            return item;
              }
            }
          });
        }

}])

app.controller('AnalyticsController', ['getCityData', function(getCityData){
  var vm = this;
  console.log('analytics controller');
  getCityData.getAllTheData();

}])

app.controller('modalController', ['$uibModalInstance', 'updateCityData', 'getCityData', 'item', function($uibModalInstance, updateCityData, getCityData, item){
  var vm = this;
  vm.item = item

  console.log('item in modal', vm.item);
  console.log(item.photo_url);

    vm.fixWiseUp = function(){
      console.log('item in fix Wise Up', vm.item);
      updateCityData.update(vm.item)
      .then(function(data){
        console.log(data);
      })
      .catch(function(err){
        console.log('error', err);
      })
    }

    vm.archiveWiseUp = function(){
      updateCityData.archive(vm.item)
      .then(function(data){
        console.log(data);
      })
      .catch(function(err){
        console.log('error', err);
      })
    }

    vm.updateFixed = function(item){
      updateView(vm.item, getCityData.wiseups.current, getCityData.wiseups.fixed);
      toggleItem(vm.item, 'is_fixed');
    }

    vm.updateArchive = function(item){
      updateView(vm.item, getCityData.wiseups.current, getCityData.wiseups.archived)
      toggleItem(vm.item, 'is_archived')
    }

    vm.undoFixed = function(item){
      updateView(vm.item, getCityData.wiseups.fixed, getCityData.wiseups.current);
      toggleItem(vm.item, 'is_fixed');
    }

    vm.undoArchive = function(item){
      updateView(vm.item, getCityData.wiseups.archived, getCityData.wiseups.current);
      toggleItem(vm.item, 'is_archived');
    }

    var updateView = function(item, arrFrom, arrTo){
      var itemToAdd = arrFrom.splice(arrFrom.indexOf(item),1)
      arrTo.push(itemToAdd[0]);
    }

    var toggleItem = function(item, key){
      item[key] = !item[key];

    }

  $uibModalInstance.rendered
  .then(function(){
    console.log('modal opened');
    getCityData.getWiseUpMap(item)
  })

  vm.close = function(){
    $uibModalInstance.close();
    }

}]);
