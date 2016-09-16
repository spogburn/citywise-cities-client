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

app.service('addCityService', ['$http', 'apiService', function($http, apiService){
  var sv = this;
  sv.signin = function(cityLogin){
    console.log('cityLogin', cityLogin);
    return $http.post(apiService.getApiUrl() + 'admin/login', cityLogin)
    }

}]);

app.service('getCityData', ['$http', 'apiService', function($http, apiService){
  var sv = this;
  sv.cleanedData = [];
  sv.getData = function(){
    console.log('getting zee data');
    return $http.get(apiService.getApiUrl() + 'api/city-wise');
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

app.service('getMapService', ['getCityData', function(getCityData){
  var sv = this;
  sv.markerList = [];
  var points = [];
  var map;
  var items;
  var lat = '';
  var long = '';
  sv.getData = function(){
    getCityData.getData()
    .then(function(data){
      items = data.data;

      makeMap(items[0].lat, items[0].long)

      for (var i = 0; i < items.length; i++){
        makeMarker(items[i].category, items[i].issue, items[i].photo_url, items[i].lat, items[i].long, items[i].id)
      }

    })
    .catch(function(err){
      console.log(err);
    })
  }

  var makeMap = function(lat, long){
    map = new google.maps.Map(document.getElementById('map'), {
     zoom: 12,
     center: new google.maps.LatLng(lat, long),
     draggable: true,
     mapTypeId: google.maps.MapTypeId.ROADMAP
   });

   map.addListener('click', function(e){
     var iw = document.querySelector('.gm-style-iw')
     iw.close();

   })

  }

  var makeMarker = function(category, issue, image, lat, long, id){

    var contentStr = '<div class="iw-container">' + '<div class="iw-title">' + category + '</div><div class="iw-content"><img src="' + image + '" height="75" width="75" class="iw-image">' +
                      '<p>'+ issue + '</p></div></div>';

    var infoWindow = new google.maps.InfoWindow({
      content: contentStr,
      maxWidth: 400
    })

    var marker = new google.maps.Marker({
      map: map,
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


  var pos = {};
    // Try HTML5 geolocation.
        // if (navigator.geolocation) {
        //   navigator.geolocation.getCurrentPosition(function(position) {
        //      pos = {
        //       lat: position.coords.latitude,
        //       lng: position.coords.longitude
        //     };
        //     console.log(pos);
        //   }, function() {
        //     handleLocationError(true, infoWindow, map.getCenter());
        //   });
        // } else {
        //   // Browser doesn't support Geolocation
        //   handleLocationError(false, infoWindow, map.getCenter());
        // }





}])
