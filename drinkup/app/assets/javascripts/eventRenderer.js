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
              coords: { 
                latitude:map.getCenter().lat(),
                longitude:map.getCenter().lng()
              },
              action: "drag"
            };
    initializeMarkers(position);
    
  });


  autocomplete.addListener('place_changed', storePositionforDrinkups);
}

function storePositionforDrinkups() {
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

function createDrinkupMarker(place,drinkup,number,isAttending) {
    var image='http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+number+'|FE6256|000000';
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: image
    });

    var start_time = moment.utc(drinkup.start_time).format('MMMM Do YYYY, h:mm a');
    var end_time = moment.utc(drinkup.end_time).format('MMMM Do YYYY, h:mm a');

    $(marker).data('drinkupData', { id : drinkup.id, name : drinkup.name, location_name: place.name, location_address : place.vicinity,
        start_time : start_time, end_time : end_time, isUserAttending : isAttending, count : drinkup.count
    });

    markers.push(marker);

    getTopConversations(drinkup.id).then(function (data) {
      $(marker).data('topConversations', data.top_conversations);
      var drinkupData = $(marker).data("drinkupData");

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(drinkupData.name + "<br />" + drinkupData.location_name + 
          "<br />" + drinkupData.location_address + "<br />" + "Attendees: " + drinkupData.count + "<br />");
        infowindow.open(map, marker);
        fillEventContent(marker);
      });
    });
}

function createMarkerForEventsAroundYou(drinkup,number,isAttending,stopBound) {
    service.getDetails({ placeId: drinkup.place_id }, function(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (stopBound == false) {
          var lat=place.geometry.location.lat();
          var lng=place.geometry.location.lng();
          bounds.extend(new google.maps.LatLng(lat, lng));
          createDrinkupMarker(place, drinkup, number, isAttending);
          map.fitBounds(bounds);
        }
        else {
          createDrinkupMarker(place, drinkup, number, isAttending);
        }
      }
    });
}

function initializeMarkers(position) {
  document.getElementById('error').innerHTML="";
  var crd = position.coords;
  var geoCookie = crd.latitude + "|" + crd.longitude;
  document.cookie = "lat_lng=" + escape(geoCookie);

  $.getJSON("/events/getEvents", function (data) {
    var drinkups = data.events;
    var drinkups_attending = data.events_attending;
    var stopBound;
    deleteMarkers();
    if (position.action == null) {
        stopBound = false;
        createBounds();
    } else {
        stopBound = true;
    }
    for(i = 0; i < drinkups.length; i++) {
      var isAttending = false;
      if ($.inArray(drinkups[i].id, drinkups_attending) !== -1) {
        isAttending = true;
      }
      createMarkerForEventsAroundYou(drinkups[i], i+1, isAttending, stopBound);
    }
  });
}

function getTopConversations(drinkupId) {
    return $.ajax({
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      url: "/events/"+drinkupId+"/getTopConversations"
    });
}

function fillEventContent(marker) {
    var drinkupData = $(marker).data("drinkupData");
    var topConversations = $(marker).data("topConversations")
    var drinkupListing = $("#drinkup_listing");
    var eventLinkAttend = $("#event_link_attend");
    var drinkupAttendeeLimit = 8;

    if(!drinkupListing.is(":visible")) {
      drinkupListing.slideDown(500);
      $("#inspirational_quote").hide();
    }

    // Fill in event content show after clicking on drinkup on map
    $("#drinkup_name").html(drinkupData.name);
    $("#drinkup_location_name").html(drinkupData.location_name);
    $("#drinkup_location_address").html(drinkupData.location_address);
    $("#drinkup_start_time").html(drinkupData.start_time);
    $("#drinkup_end_time").html(drinkupData.end_time);

    var conversationTagsHTML = "";
    $.each(topConversations, function(key, value){
      var conversationSpan = "<span class='conversation_tag selected'>" + value + "</span>";
      conversationTagsHTML += conversationSpan;
    });
    $("#drinkup_conversations").html(conversationTagsHTML);

    $("#event_link_show").attr("href", "/events/" + drinkupData.id);
    if (drinkupData.count > drinkupAttendeeLimit && !drinkupData.isUserAttending) {
      eventLinkAttend.removeAttr("href");
      eventLinkAttend.addClass("inactive");
      eventLinkAttend.text("Drinkup is full");
    } else {
      if (!drinkupData.isUserAttending) {
        eventLinkAttend.attr("href", "/events/join/" + drinkupData.id);
        eventLinkAttend.removeClass("inactive");
        eventLinkAttend.text("Attend")
      } else {
        eventLinkAttend.attr("href", "/events/unjoin/" + drinkupData.id);
        eventLinkAttend.removeClass("inactive");
        eventLinkAttend.text("Unattend")
      }
    }
}
