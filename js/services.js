'use strict';

app.service('apiService', ['$location', function($location){
  var sv = this;
  sv.getApiUrl = function(){
    // if ($location.host() === 'localhost') {
    //   return '//localhost:3000/'; // development api url
    // }
    return 'https://city-wise.herokuapp.com/'; // heroku api url
  };
}]);

app.service('loginService', ['$http', 'apiService', function($http, apiService){
  var sv = this;
  sv.signin = function(cityLogin){
    console.log('cityLogin', cityLogin);
    return $http.post(apiService.getApiUrl() + 'admin/login', cityLogin)
    }

}]);

app.service('getCityData', ['$http', 'apiService', function($http, apiService){
  var sv = this;
  sv.wiseups = {
    current: [],
    fixed: [],
    archived: []
  };

  $http.get(apiService.getApiUrl() + 'api/city-wise')
    .then(function(data){
      var temp = data.data;
      console.log('temp', data);
      for (var i = 0; i < temp.length; i++){
        if (temp[i].is_fixed === false && temp[i].is_archived === false){
          console.log('current');
          sv.wiseups.current.push(temp[i])
        }
        else if (temp[i].is_fixed == true){
          console.log('fixed true');
          sv.wiseups.fixed.push(temp[i])
        }
        else if (temp[i].is_archived === true){
          sv.wiseups.archived.push(temp[i])
        }
        else if (i === temp.length){
          drawMap(sv.wiseups.current)
        }
      }
    })
    .catch(function(err){
      console.log(err);
    });

    sv.markerList = [];
    var points = [];
    var map;
    var smMap;
    var lat = '';
    var long = '';

    var drawMap = function(items){
      makeMap(items[0].lat, items[0].long)
      for (var i = 0; i < items.length; i++){
        makeMarker(items[i].category, items[i].issue, items[i].photo_url, items[i].lat, items[i].long, items[i].id, map)
          }
        }


    sv.getWiseUpMap = function(item){
      console.log('item:', item);
      makeSmMap(Number(item.lat), Number(item.long))
      makeMarker(item.category, item.issue, item.photoUrl, item.lat, item.long, item.id, smMap)
      // makeMarker(item.category, item.issue, item.image, item.lat, item.long)
    }

    var makeSmMap = function(lat, long){
        smMap = new google.maps.Map(document.getElementById('smMap'), {
        zoom: 15,
        center: new google.maps.LatLng(lat, long),
        draggable: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    }

    var makeMap = function(lat, long){
      map = new google.maps.Map(document.getElementById('map'), {
       zoom: 12,
       center: new google.maps.LatLng(lat, long),
       draggable: true,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     });
     //
    //  map.addListener('click', function(e){
    //    var iw = document.querySelector('.gm-style-iw')
    //    iw.close();
     //
    //  })

    }

    var makeMarker = function(category, issue, image, lat, long, id, mapName){

      var contentStr = '<div class="iw-container">' + '<div class="iw-title">' + category + '</div><div class="iw-content"><img src="' + image + '" height="75" width="75" class="iw-image">' +
                        '<p>'+ issue + '</p></div></div>';

      var infoWindow = new google.maps.InfoWindow({
        content: contentStr,
        maxWidth: 400
      })

      var marker = new google.maps.Marker({
        map: mapName,
        draggable: true,
        animation: google.maps.Animation.drop,
        position: {lat: Number(lat), lng: Number(long)},
        item_id: id
      })

      marker.addListener('click', function(){
        infoWindow.open(map, marker)
        console.log('marker id', marker.item_id);
      })

    }



}])

app.service('updateCityData', ['$http', 'apiService', function($http, apiService){
  var sv = this;

  sv.update = function(item){
    console.log('item fixed state', item.is_fixed);
    var id = item.id;
    var is_fixed = !item.is_fixed;
    return $http.put(apiService.getApiUrl() + 'api/city-wise/' + id + '/fixed', {is_fixed: is_fixed});
  }
  sv.archive = function(item){
    var id = item.id;
    var is_archived = !item.is_archived;
    return $http.put(apiService.getApiUrl() + 'api/city-wise/' + id + '/archive', {is_archived: is_archived})
  }


}])

app.service('sortDataService', [function(){
  var sv = this;
  sv.filtered = {};
  sv.filterByCategory = function(filter, arr){
    sv.filtered.filteredWiseups = [];
    for (var i = 0; i < arr.length; i++){
      if (arr[i].category === filter) {
          console.log('in filter', arr[i].category);
        sv.filtered.filteredWiseups.push(arr[i]);
      }
    }
    console.log(sv.filtered.filteredWiseups);
  }

}])
//
//
// app.service('getMapService', [function(){
//   var sv = this;
//   sv.markerList = [];
//   var points = [];
//   var map;
//   var smMap;
//   var lat = '';
//   var long = '';
//
//   sv.drawMap = function(items){
//     makeMap(items[0].lat, items[0].long)
//     for (var i = 0; i < items.length; i++){
//       makeMarker(items[i].category, items[i].issue, items[i].photo_url, items[i].lat, items[i].long, items[i].id, map)
//         }
//       }
//
//
//
//   sv.getWiseUpMap = function(item){
//     console.log('item:', item);
//     makeSmMap(Number(item.lat), Number(item.long))
//     makeMarker(item.category, item.issue, item.photoUrl, item.lat, item.long, item.id, smMap)
//     // makeMarker(item.category, item.issue, item.image, item.lat, item.long)
//   }
//
//   var makeSmMap = function(lat, long){
//       smMap = new google.maps.Map(document.getElementById('smMap'), {
//       zoom: 15,
//       center: new google.maps.LatLng(lat, long),
//       draggable: true,
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//     });
//   }
//
//   var makeMap = function(lat, long){
//     map = new google.maps.Map(document.getElementById('map'), {
//      zoom: 12,
//      center: new google.maps.LatLng(lat, long),
//      draggable: true,
//      mapTypeId: google.maps.MapTypeId.ROADMAP
//    });
//    //
//   //  map.addListener('click', function(e){
//   //    var iw = document.querySelector('.gm-style-iw')
//   //    iw.close();
//    //
//   //  })
//
//   }
//
//   var makeMarker = function(category, issue, image, lat, long, id, mapName){
//
//     var contentStr = '<div class="iw-container">' + '<div class="iw-title">' + category + '</div><div class="iw-content"><img src="' + image + '" height="75" width="75" class="iw-image">' +
//                       '<p>'+ issue + '</p></div></div>';
//
//     var infoWindow = new google.maps.InfoWindow({
//       content: contentStr,
//       maxWidth: 400
//     })
//
//     var marker = new google.maps.Marker({
//       map: mapName,
//       draggable: true,
//       animation: google.maps.Animation.drop,
//       position: {lat: Number(lat), lng: Number(long)},
//       item_id: id
//     })
//
//     marker.addListener('click', function(){
//       infoWindow.open(map, marker)
//       console.log('marker id', marker.item_id);
//     })
//
//   }
//
//
//   var pos = {};
//     // Try HTML5 geolocation.
//         // if (navigator.geolocation) {
//         //   navigator.geolocation.getCurrentPosition(function(position) {
//         //      pos = {
//         //       lat: position.coords.latitude,
//         //       lng: position.coords.longitude
//         //     };
//         //     console.log(pos);
//         //   }, function() {
//         //     handleLocationError(true, infoWindow, map.getCenter());
//         //   });
//         // } else {
//         //   // Browser doesn't support Geolocation
//         //   handleLocationError(false, infoWindow, map.getCenter());
//         // }
//
//
//
//
//
// }])
