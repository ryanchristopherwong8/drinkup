var map;
var autocomplete;
var service;
var postionOfUserFromGeolocation= new Array;
var drinktype='bar';
var infowindow;
var bounds;
var markers=[];

function setDrinktype(type) {
  drinktype = type;
  if (postionOfUserFromGeolocation[0]==null && postionOfUserFromGeolocation[1]==null) {
    document.getElementById('error').innerHTML="Please Enter a Location";
  }
  else {
    deleteMarkers();
    changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
    setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, drinktype,0);
  }
}

function getUserLocation() {
	if (navigator.geolocation) {
		var options={timeout:30000};
    navigator.geolocation.getCurrentPosition(storePosition,getManualLocation,options);
  } 
}

function storePosition(position) {
  deleteMarkers();
	postionOfUserFromGeolocation[0]=position.coords.latitude;
	postionOfUserFromGeolocation[1]=position.coords.longitude;
	changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
  setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000,drinktype,0);
}

function getManualLocation(error) {
	//generate message that location could not be got
  console.log(error);
  document.getElementById('error').innerHTML="Could Not Get Geolocation";
} 

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  autocomplete.addListener('place_changed', storePositionFromGoogleAPI);
}

function initMap(lat_user,lng_user,zoom, type) {
  var user_location = {lat:lat_user , lng:lng_user};

  map = new google.maps.Map(document.getElementById('map'), {
      center: user_location,
      zoom: zoom
        });

  map.addListener('dragend', function() {
    for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
    markers=[];
    postionOfUserFromGeolocation[0]=map.getCenter().lat();
    postionOfUserFromGeolocation[1]=map.getCenter().lng();
    if (type == "create") {
    	setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000,drinktype,1);
    }
    
  });
  service = new google.maps.places.PlacesService(map);
  infowindow = new google.maps.InfoWindow();
}

function changeMapLocation(lat_user,lng_user,zoom) {
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
  setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, drinktype,0);
}

//creates a nearby search request to google service
function setup(lat_user,lng_user,radius,drinktype,stopBound) {
  document.getElementById('error').innerHTML="";
  var user_location = {lat:lat_user , lng:lng_user};
  
   var request = {
    location: user_location,
    radius: radius,
    types: [drinktype]
  };
  
  service.nearbySearch(request, function(results,status) {
    callbackFunction(results,status,stopBound);
  });

}

function callbackFunction(results, status,stopBound) {
  var numberResultsToReturn=results.length;
  var resultsList = document.getElementById("resultsList");

  //removes results from previous search
  while (resultsList.firstChild) {
    resultsList.removeChild(resultsList.firstChild);
  }

  if (results.length>8) {
    numberResultsToReturn=8;
  }

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < numberResultsToReturn; i++) {
      if (stopBound==0) {
        var lat=results[i].geometry.location.lat();
        var lng=results[i].geometry.location.lng();
        bounds.extend(new google.maps.LatLng(lat, lng));
        createMarker(results[i],(i+1));
      }
      else {
        createMarker(results[i],(i+1));
      }
    }
    createShowListButton();
    renderListWithPhotos(results);
  }
  if (stopBound==0) {
    map.fitBounds(bounds);
  }
}


function createMarker(place,number) {
    var image= createImage("/assets/bar.png");
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: image
    });

    $(marker).data('locationData', { location_name: place.name, location_address: place.vicinity, 
        lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), place_id: place.place_id });

    markers.push(marker);
  

    google.maps.event.addListener(marker, 'click', function() {
      var locationData = $(marker).data("locationData")
      fillForm(locationData);

      infowindow.setContent(place.name + "<br />" + place.vicinity + "<br />");
      infowindow.open(map, this);
  });
        
}

function createImage(url){
  var image = {
    url: url,
    // This marker is 33 pixels wide by 45 pixels tall.
    size: new google.maps.Size(33, 45)
  };
  return image;
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
