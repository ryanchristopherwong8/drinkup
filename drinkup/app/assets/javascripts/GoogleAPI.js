var map;
var autocomplete;
var service;
var postionOfUserFromGeolocation=new Array;
var drinktype='bar';
var infowindow;
var bounds;
var markers=[];

function setDrinktypeCafe() {
  drinktype = 'cafe'
  var x=document.getElementById("cafeSelector");
  var y=document.getElementById("barSelector");
  x.style.backgroundColor == "aquamarine";
  y.style.backgroundColor == "buttonface";
  deleteMarkers();
  changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
  setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, drinktype);

}

function setDrinktypeBar() {
  drinktype = 'bar'
  deleteMarkers();
  changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
  setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, drinktype);
}

function getUserLocation() {
	if (navigator.geolocation) {
		var options={timeout:30000};
    navigator.geolocation.getCurrentPosition(storePosition,getManualLocation,options);
  } 
}

function getUserLocationforDrinkups() {
  if (navigator.geolocation) {
    var options={timeout:30000};
    navigator.geolocation.getCurrentPosition(setGeoCookie,getManualLocation,options);
  } 
}

function setGeoCookie(position) {
  var crd = position.coords;

  var geoCookie = crd.latitude + "|" + crd.longitude;
  document.cookie = "lat_lng=" + escape(geoCookie);
}

function storePosition(position) {
  deleteMarkers();
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

function changeMapLocation(lat_user,lng_user,zoom){
	var user_location = {lat:lat_user , lng:lng_user};
	map.setCenter(user_location);
  map.setZoom(zoom);
}

function storePositionFromGoogleAPI(){
  deleteMarkers();
	var place = autocomplete.getPlace();
	postionOfUserFromGeolocation[0]=place.geometry.location.lat();
	postionOfUserFromGeolocation[1]=place.geometry.location.lng();
	changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
  setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, drinktype);
}

function setup(lat_user,lng_user,radius,drinktype){
  document.getElementById('error').innerHTML="";
  var user_location = {lat:lat_user , lng:lng_user};
  
   var request = {
    location: user_location,
    radius: radius,
    types: [drinktype]
  };
  
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  var numberResultsToReturn=results.length;
  var resultsList = document.getElementById("resultsList");

  //removes results from previous search
  while (resultsList.firstChild) {
    resultsList.removeChild(resultsList.firstChild);
  }

  if (results.length>8)
  {
    numberResultsToReturn=8;
  }

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < numberResultsToReturn; i++) {
      var lat=results[i].geometry.location.lat();
      var lng=results[i].geometry.location.lng();
      bounds.extend(new google.maps.LatLng(lat, lng));
      createMarker(results[i],(i+1));
    }
    renderList(results);
  }
  map.fitBounds(bounds);
}


function createMarker(place,number) {
        var image='http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+number+'|FE6256|000000';
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: image
        });

  $(marker).data('locationData', { location_name: place.name, location_address: place.vicinity, 
        lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), place_id: place.place_id });

  markers.push(marker);
       
  //TODO refactor
  google.maps.event.addListener(marker, 'click', function() {
    var locationData = $(marker).data("locationData")
    $("#event_location_name").val(locationData.location_name);
    $("#event_location_address").val(locationData.location_address);
    $("#lat").val(locationData.lat);
    $("#lng").val(locationData.lng);
    $("#place_id").val(locationData.place_id);

    infowindow.setContent(place.name + "<br />" + place.vicinity + "<br />");
    infowindow.open(map, this);
  });
        
}

function createDrinkupMarker(place,drinkup,number) {
      var image='http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+number+'|FE6256|000000';
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: image
      });

      markers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(drinkup.name + "<br />" + place.name + "<br />" + place.vicinity + "<br />");
        infowindow.open(map, this);
      });
}



function createMarkerForEventsAroundYou(drinkup,number) {
    service.getDetails({ placeId: drinkup.place_id }, function(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var lat=place.geometry.location.lat();
        var lng=place.geometry.location.lng();
        bounds.extend(new google.maps.LatLng(lat, lng));
        createDrinkupMarker(place, drinkup, number);
        map.fitBounds(bounds);
      }
    });
}

function createBounds() {
    bounds = new google.maps.LatLngBounds()
}

function deleteMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  createBounds();
  markers = [];
}
