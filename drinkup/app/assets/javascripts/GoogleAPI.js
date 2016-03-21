var user_location;
var drinktype='bar';
var radius_distance=1000;
var postionOfUserFromGeolocation=new Array;

function getUserLocation()
{
	if (navigator.geolocation) 
	{
		console.log("nav");
		var options={timeout:30000};
        navigator.geolocation.getCurrentPosition(storePosition,showError,options);
    } 
}

function storePosition(position) {
	console.log("show store");
	postionOfUserFromGeolocation[0]=position.coords.latitude;
	postionOfUserFromGeolocation[1]=position.coords.longitude;
	initMap();
}

function showError(error) {
	console.log("show error");
	console.warn('ERROR(' + error.code + '): ' + error.message);
}

var map;

      function initMap() {
		console.log(postionOfUserFromGeolocation[0]);
		console.log(postionOfUserFromGeolocation[1]);
        var user_location = {lat:postionOfUserFromGeolocation[0] , lng:postionOfUserFromGeolocation[1]};

        map = new google.maps.Map(document.getElementById('map'), {
          center: user_location,
          zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: user_location,
          radius: radius_distance,
          type: [drinktype]
        }, callback);
      }

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }

