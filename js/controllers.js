'use strict';

app.controller('LoginController', ['$http', '$window', '$location', 'loginService', function($http, $window, $location, ls){
  var vm = this;
  vm.place = null;
  vm.signinInfo = {};
  vm.error = {};

  vm.submit = function(){
    ls.signin(vm.signinInfo)
    .then(function(data){
        console.log('data', data);
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
      console.log(err);
    });
  };

  vm.logout = function(){
    $window.localStorage.clear();
    $location.path('/');
  }

}])

app.controller('DashboardController', ['$http', '$window', 'ModalService', '$uibModal', '$q', 'getCityData', 'updateCityData', 'sortDataService', 'getMapService', '$location', function($http, $window, ModalService, $uibModal, $q, getCityData, updateCityData, sortDataService, getMapService, $location){
  var vm = this;
  vm.currentWiseups = [];
  vm.fixedWiseups = [];
  vm.archivedWiseups = [];
  vm.filtered = '';
  vm.username = $window.localStorage.username;
  vm.currentDate = new Date()
  vm.getCityData = getCityData.getData()
    .then(function(data){
      var temp = data.data;
      for (var i = 0; i < temp.length; i++){
        if (temp[i].is_fixed === false && temp[i].is_archived === false){
          console.log('current');
          vm.currentWiseups.push(temp[i])
        }
        else if (temp[i].is_fixed == true){
          console.log('fixed true');
          vm.fixedWiseups.push(temp[i])
        }
        else if (temp[i].is_archived === true){
          vm.archivedWiseups.push(temp[i])
        }
      }
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

  vm.filterByCategory = function(filter){
    sortDataService.filterByCategory(filter, vm.currentWiseups)
  }

  vm.showImageModal = function(item) {
    var modalInstance = $uibModal.open({
      templateUrl: "./templates/imagemodal.html",
      controller: 'modalController as ModC',
      resolve: {
        item: function () {
          return item;
            }
          }
        });
      }
}])

//  var myModal = ModalService.showModal({
//    templateUrl: "./templates/imagemodal.html",
//    controller: function($scope, close) {
 //
 //
//   // $window.on('shown', function(){
//   //   getMapService.getWiseUpMap(item)
//   // });
//   //
 //
 //
//     $scope.fixWiseUp = function(){
//       updateCityData.update(item)
//       .then(function(data){
//         console.log(data);
//       })
//       .catch(function(err){
//         console.log('error', err);
//       })
//     }
 //
//     $scope.archiveWiseUp = function(){
//       updateCityData.archive(item)
//       .then(function(data){
//         console.log(data);
//       })
//       .catch(function(err){
//         console.log('error', err);
//       })
//     }
 //
//     $scope.updateFixed = function(item){
//       updateView(item, vm.currentWiseups, vm.fixedWiseups);
//       toggleItem(item, 'is_fixed');
//     }
 //
//     $scope.updateArchive = function(item){
//       updateView(item, vm.currentWiseups, vm.archivedWiseups)
//       toggleItem(item, 'is_archived')
//     }
 //
//     $scope.undoFixed = function(item){
//       updateView(item, vm.fixedWiseups, vm.currentWiseups);
//       toggleItem(item, 'is_fixed');
//     }
 //
//     $scope.undoArchive = function(item){
//       updateView(item, vm.archivedWiseups, vm.currentWiseups);
//       toggleItem(item, 'is_archived');
//     }
 //
//     $scope.item = item;
//     $scope.dismissModal = function() {
//        close(200); // close, but give 200ms for bootstrap to animate
//       };
//     }
//   })
//   .then(function(modal) {
//   console.log('item in then', item);
//    // The modal object has the element built, if this is a bootstrap modal
//    // you can call 'modal' to show it, if it's a custom modal just show or hide
//    // it as you need to.
//    modal.element.modal();
//    getMapService.getWiseUpMap(item)
 //
//    modal.close.then(function(){
//     });
//  });
app.controller('modalController', ['$uibModalInstance', 'item', function($uibModalInstance, item){
  var vm = this;
  vm.item = item;
  console.log('item in modal', item);
  vm.close = function(){
    $uibModalInstance.close();
    }

}]);

app.controller('MapController', ['getMapService', function(getMapService){
  var vm = this;
  vm.getData = getMapService.getData();

}])


var updateView = function(item, arrFrom, arrTo){
  var itemToAdd = arrFrom.splice(arrFrom.indexOf(item),1)
  arrTo.push(itemToAdd[0]);
}

var toggleItem = function(item, key){
  item[key] = !item[key];

}
