//initializes dynamic content and gets user location
//code is only called on events index page
$(document).ready(function(){
  initMap(49.2667967,-123.2056314,10, "search")
  initAutocompleteforDrinkups()
  $("#drinkup_listing").hide();
  $("#My-Events-Title").hide();
  getUserLocationforDrinkups();
  getEventsForCurrentUser();
});

var inCache;
var cachedDrinkUps=[];

//prompts user for permission to get current location
function getUserLocationforDrinkups() {
  if (navigator.geolocation) {
    var options={timeout:30000};
    navigator.geolocation.getCurrentPosition(initializeMarkers,unableToGetLocation,options);
  } 
}


  // Create the autocomplete object, restricting the search to geographical
  // location types.
function initAutocompleteforDrinkups() {
  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('autocomplete')),
      {types: ['geocode']});

  //adds drag listener and calls initialize markers on drag finish
  //stores current position as maps new center
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

  //checks for change of place in autocomplete and calls storePositionforDrinkups
  autocomplete.addListener('place_changed', storePositionforDrinkups);
}

//called when autocomplete has entered new search
//stores position as map's new center and renders event markers based on new position
function storePositionforDrinkups() {
  var place = autocomplete.getPlace();
  var position= {
    coords: {latitude:place.geometry.location.lat(),longitude:place.geometry.location.lng()}
  };
  changeMapLocationforDrinkups(position.coords.latitude,position.coords.longitude,15);

  initializeMarkers(position);
}

//renders maps new center
function changeMapLocationforDrinkups(lat_user,lng_user,zoom){
  var user_location = {lat:lat_user , lng:lng_user};
  map.setCenter(user_location);
  map.setZoom(zoom);
}

//creates drink up marker and stores drink up data in marker
//and adds listener to render info window on click
function createDrinkupMarker(place,drinkup,number,isAttending, isCreator) {

    //creates new drink up marker image
    var drink = drinkup.drink_type;
    if (drink === 'bar'){
      var imgPath = "/assets/bar-c0a6f42f7105bfe7f811f503bdd61ee14ac0496914906fd3b351b2f5cc114e8d.png";
    }else{
      var imgPath = "/assets/cafe-d6c6596d6c85821bcdb400dc790626f83aee2982e90721ea51debfe868ac5738.png";
    }
    //sets marker location to place location
    var placeLoc = place.geometry.location;

    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: imgPath
    });
    //create start and end time info
    var start_time = moment.utc(drinkup.start_time).format('MMMM Do YYYY, h:mm a');
    var end_time = moment.utc(drinkup.end_time).format('MMMM Do YYYY, h:mm a');
    var time_zone = moment().tz(String(drinkup.timeZoneId)).format('z');

    //store drink up data on marker
    $(marker).data('drinkupData', { id : drinkup.id, name : drinkup.name, location_name: place.name, location_address : place.vicinity,
        start_time : start_time, end_time : end_time, time_zone : time_zone ,isUserAttending : isAttending, isUserCreator: isCreator, count : drinkup.count
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

function createMarkerForEventsAroundYou(drinkup,number,isAttending,isCreator,stopBound) {
    service.getDetails({ placeId: drinkup.place_id }, function(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (stopBound == false) {
          var lat=place.geometry.location.lat();
          var lng=place.geometry.location.lng();
          bounds.extend(new google.maps.LatLng(lat, lng));
          createDrinkupMarker(place, drinkup, number, isAttending, isCreator);
          map.fitBounds(bounds);
        }
        else {
          createDrinkupMarker(place, drinkup, number, isAttending, isCreator);
        }
      }
    });
}

function initializeMarkers(position) {
  document.getElementById('error').innerHTML="";
  var crd = position.coords;
  var geoCookie = crd.latitude + "|" + crd.longitude;
  document.cookie = "lat_lng=" + escape(geoCookie);
  if (position.action !== "drag"){
    $(".loading-spinner").show();
  }
  
  $.getJSON("/events/getEvents", function (data) {
    var drinkups = data.events;
    if (drinkups.length==0){
      document.getElementById('error').innerHTML="No Drinkups Around You";
    }
    if (position.action=="drag"){

      if (drinkups.length!=cachedDrinkUps.length){
        inCache=false;
      }
      else{
        for (i=0; i<drinkups.length; i++){
          if ($.inArray(drinkups[i].id,cachedDrinkUps)!==-1){
            inCache=true;
          }
          else
          {
            inCache=false;
            break;
          }
        }
      }
    
      if (inCache==true){
        
        return;
      }
      else if (inCache==false){
        cachedDrinkUps=[];
        for (i=0; i<drinkups.length; i++){
          cachedDrinkUps.push(drinkups[i].id);
        }
      }
    }
    
    var drinkups_attending = data.events_attending;
    var drinkups_creator = data.events_creator;
    var stopBound;
    deleteMarkers();
    if (position.action == null) {
        stopBound = false;
        bounds = new google.maps.LatLngBounds()
    } else {
        stopBound = true;
    }
    for(i = 0; i < drinkups.length; i++) {
      var isAttending = false;
      var isCreator = false;
      if ($.inArray(drinkups[i].id, drinkups_attending) !== -1) {
        isAttending = true;
      }
      if ($.inArray(drinkups[i].id, drinkups_attending) !== -1) {
        isCreator = true;
      }
      createMarkerForEventsAroundYou(drinkups[i], i+1, isAttending, isCreator, stopBound);
    }
    $(".loading-spinner").hide();
  });
}

//makes call to server to get all events user is attending
//renders the events list using event infomation
function getEventsForCurrentUser()
{
    $.getJSON("/users/"+gon.user_id+"/getCurrentEventsForUser", function (data) {
    var events = data.events_currentUser;
    renderListWithPhotos(events,"indexPage");
  });
}

//creates a container that slides down on marker click
//fills the contains with data from marker
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
    $("#drinkup_start_time").html(drinkupData.start_time + " " + drinkupData.time_zone);
    $("#drinkup_end_time").html(drinkupData.end_time + " " + drinkupData.time_zone);

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
        eventLinkAttend.removeClass("inactive");
        eventLinkAttend.text("Attend");
        eventLinkAttend.on("click", function(e) {
          joinEvent(drinkupData.id);
        });
      } else {
        eventLinkAttend.removeClass("inactive");
        eventLinkAttend.text("Unattend");
        eventLinkAttend.on("click", function(e) {
          unjoinEvent(drinkupData.id);
        });
      }
    }
}
;
