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
  if (postionOfUserFromGeolocation[0]==null && postionOfUserFromGeolocation[1]==null)
  {
    document.getElementById('error').innerHTML="Please Enter a Location";
  }
  else
  {
    deleteMarkers();
    changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
    setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, drinktype);
  }
  

}

function setDrinktypeBar() {
  drinktype = 'bar'
  if (postionOfUserFromGeolocation[0]==null && postionOfUserFromGeolocation[1]==null)
  {
    document.getElementById('error').innerHTML="Please Enter a Location";
  }
  else
  {
    deleteMarkers();
    changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
    setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, drinktype);
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
  setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000,drinktype);
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

//creates a nearby search request to google service
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
    createShowListButton();
    //rederList(results);
    renderListWithPhotos(results);
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
  

    google.maps.event.addListener(marker, 'click', function() {
    var locationData = $(marker).data("locationData")
    fillForm(locationData);

    infowindow.setContent(place.name + "<br />" + place.vicinity + "<br />" + photoSource);
    infowindow.open(map, this);
  });
        
}

function createDrinkupMarker(place,drinkup,number,isAttending) {
    var image='http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+number+'|FE6256|000000';
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: image
    });

    var start_time = moment(drinkup.start_time).format('MMMM Do YYYY, h:mm a');
    var end_time = moment(drinkup.end_time).format('MMMM Do YYYY, h:mm a');

    $(marker).data('drinkupData', { id : drinkup.id, name : drinkup.name, location_name: place.name, location_address : place.vicinity,
      start_time : start_time, end_time : end_time, isUserAttending : isAttending
    });
  
    infowindow.setContent(drinkup.name + "<br />" + place.name + "<br />" + place.vicinity + "<br />");
    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, this);
      var drinkupData = $(marker).data("drinkupData");

      if(!$("#drinkup_listing").is(":visible")) {
        $("#drinkup_listing").slideDown(500);
        $("#inspirational_quote").hide();
      }

      $("#drinkup_name").html(drinkupData.name);
      $("#drinkup_location_name").html(drinkupData.location_name);
      $("#drinkup_location_address").html(drinkupData.location_address);
      $("#drinkup_start_time").html(drinkupData.start_time);
      $("#drinkup_end_time").html(drinkupData.end_time);

      $("#event_link_show").attr("href", "/events/" + drinkupData.id);
      if (!drinkupData.isUserAttending) {
        $("#event_link_attend").attr("href", "/events/join/" + drinkupData.id);
        $("#event_link_attend").text("Attend")
      } else {
        $("#event_link_attend").attr("href", "/events/unjoin/" + drinkupData.id);
        $("#event_link_attend").text("Unattend")
      }
    });
}



function createMarkerForEventsAroundYou(drinkup,number,isAttending,stopBound) {
    service.getDetails({ placeId: drinkup.place_id }, function(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (stopBound==0)
        {
          var lat=place.geometry.location.lat();
          var lng=place.geometry.location.lng();
          bounds.extend(new google.maps.LatLng(lat, lng));
          createDrinkupMarker(place, drinkup, number, isAttending);
          map.fitBounds(bounds);
        }
        else
        {
          createDrinkupMarker(place, drinkup, number, isAttending);

        }
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
