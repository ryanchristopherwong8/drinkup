$(document).ready(function(){
  $("#drinkup_listing").hide();
});

function getUserLocationforDrinkups() {
  if (navigator.geolocation) {
    var options={timeout:30000};
    navigator.geolocation.getCurrentPosition(initializeMarkers,getManualLocation,options);
  } 
}

function initAutocompleteforDrinkups() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  map.addListener('dragend', function() {
    var position= {
              coords: {latitude:map.getCenter().lat(),longitude:map.getCenter().lng()}
            };
    initializeMarkersAfterDrag(position);
    
  });


  autocomplete.addListener('place_changed', storePositionforDrinkups);
}

function storePositionforDrinkups(){
  var place = autocomplete.getPlace();
  var position= {
    coords: {latitude:place.geometry.location.lat(),longitude:place.geometry.location.lng()}
  };
  changeMapLocationforDrinkups(position.coords.latitude,position.coords.longitude,15);

  initializeMarkers(position);
}

function changeMapLocationforDrinkups(lat_user,lng_user,zoom){
  var user_location = {lat:lat_user , lng:lng_user};
  map.setCenter(user_location);
  map.setZoom(zoom);
}

function initializeMarkers(position) {
  document.getElementById('error').innerHTML="";
  var crd = position.coords;

  var geoCookie = crd.latitude + "|" + crd.longitude;
  document.cookie = "lat_lng=" + escape(geoCookie);

  $.getJSON("/events/getEvents", function (data) {

    var drinkups = data.events;
    var drinkups_attending = data.events_attending;
    deleteMarkers();
    for(i = 0; i < drinkups.length; i++) {
      var isAttending = false;
      if ($.inArray(drinkups[i].id, drinkups_attending) !== -1) {
        isAttending = true;
      }
      createMarkerForEventsAroundYou(drinkups[i], i+1, isAttending,0);
    }
  });
}

function initializeMarkersAfterDrag(position) {
  document.getElementById('error').innerHTML="";
  var crd = position.coords;
  var geoCookie = crd.latitude + "|" + crd.longitude;
  document.cookie = "lat_lng=" + escape(geoCookie);

  $.getJSON("/events/getEvents", function (data) {

    var drinkups = data.events;
    var drinkups_attending = data.events_attending;
    for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
    markers=[];
    for(i = 0; i < drinkups.length; i++) {
      var isAttending = false;
      if ($.inArray(drinkups[i].id, drinkups_attending) !== -1) {
        isAttending = true;
      }
      createMarkerForEventsAroundYou(drinkups[i], i+1, isAttending,1);
    }
  });
}