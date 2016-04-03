$(document).ready(function(){
  $("#drinkup_listing").hide();
});

function getUserLocationforDrinkups() {
  if (navigator.geolocation) {
    var options={timeout:30000};
    navigator.geolocation.getCurrentPosition(initializeMarkers,getManualLocation,options);
  } 
}

function initializeMarkers(position) {
  var crd = position.coords;

  var geoCookie = crd.latitude + "|" + crd.longitude;
  document.cookie = "lat_lng=" + escape(geoCookie);

  $.getJSON("/events/getEvents", function (data) {

    var drinkups = data.events;
    var drinkups_attending = data.events_attending;
    createBounds();
    for(i = 0; i < drinkups.length; i++) {
      var isAttending = false;
      if ($.inArray(drinkups[i].id, drinkups_attending) !== -1) {
        isAttending = true;
      }
      createMarkerForEventsAroundYou(drinkups[i], i+1, isAttending);
    }
  });
}