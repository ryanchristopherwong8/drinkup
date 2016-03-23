var map;
var autocomplete;
var service;
var postionOfUserFromGeolocation=new Array;
var drinktype='cafe'
var infowindow;

function getUserLocation()
{
	if (navigator.geolocation) 
	{
		var options={timeout:30000};
        navigator.geolocation.getCurrentPosition(storePosition,getManualLocation,options);
    } 
}

function storePosition(position) {
	postionOfUserFromGeolocation[0]=position.coords.latitude;
	postionOfUserFromGeolocation[1]=position.coords.longitude;
	changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
  setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000,drinktype);
}

function getManualLocation(error) {
	//generate message that location could not be got
  document.getElementById('error').innerHTML="Could Not Get Geolocation";
}

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', storePositionFromGoogleAPI);
}

function initMap(lat_user,lng_user,zoom) {
  var user_location = {lat:lat_user , lng:lng_user};

  map = new google.maps.Map(document.getElementById('map'), {
      center: user_location,
      zoom: zoom
        });
  service = new google.maps.places.PlacesService(map);
  infowindow = new google.maps.InfoWindow();
      }

function changeMapLocation(lat_user,lng_user,zoom)
{
	var user_location = {lat:lat_user , lng:lng_user};
	map.setCenter(user_location);
  map.setZoom(zoom);
}

function storePositionFromGoogleAPI()
{
	var place = autocomplete.getPlace();
	postionOfUserFromGeolocation[0]=place.geometry.location.lat();
	postionOfUserFromGeolocation[1]=place.geometry.location.lng();
	changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
  setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, drinktype);
}

function setup(lat_user,lng_user,radius,drinktype)
{
  document.getElementById('error').innerHTML="";
  var user_location = {lat:lat_user , lng:lng_user};
  
        
        service.nearbySearch({
          location: user_location,
          radius: radius,
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