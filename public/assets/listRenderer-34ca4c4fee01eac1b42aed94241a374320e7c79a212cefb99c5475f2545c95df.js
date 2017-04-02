//Renders search results list on create page and 
//nearby events list on events index page


//creates list item elements and makes call to placeDetails to store data on create event page
//and creates list items with event details in event index page 
function renderListWithPhotos(results,page) {
  var numberResultsToReturn = results.length<8 ? results.length : 8;
  for(var i = 0; i < numberResultsToReturn; i++) {

    //creates initial list item element and styles 
    var locationListItem = document.createElement('li');
    if (page=="createPage")
    {
      $("#resultsList").css("display","none");
      locationListItem.setAttribute("class", "list-group-item location listItem listitem_hover");
    }else{
      //makes events title visible if list is rendered
      $("#My-Events-Title").show();
      locationListItem.setAttribute("class", "list-group-item location listItem");
    }
    

    var itemContainer = document.createElement('div');
    itemContainer.setAttribute("class", "location container");

    //place id is used for making Google's getDetails service
    var pid = results[i].place_id;
    if (page=="createPage")
    {
      createLocationImage(results[i], itemContainer);
      setPlaceDetails(pid, itemContainer,null,"createPage"); 
    }
    else if (page=="indexPage")
    {
      setPlaceDetails(pid, itemContainer,results[i],"indexPage"); 
    }
           
    locationListItem.appendChild(itemContainer);    
    $("#resultsList").append(locationListItem).attr("class","list-group well").height("250px");
  }
}

//creates place image element in list item container
function createLocationImage(place, parentNode) {
  var container = document.createElement("div");
  container.setAttribute("class","location image container");
  var image = document.createElement("img");
  var photos = place.photos;
  //if photos is not undefined, we create an image from the url in the array
  if(photos){
    var photosUrl = photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100});
    image.setAttribute("src",photosUrl);
    container.appendChild(image);
    parentNode.appendChild(container);
  }
}

//recursive function that calls setPlaceDetails until getDetails status code is OK
//results is bubbled up on success
//on success, creates a event/locations details container in list item
function setPlaceDetails(pid, parentNode,myEvent,page) {
  service.getDetails({
    placeId: pid
    }, 
    function(place, status, result) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (page=="createPage")
        {
          var detailsContainer = createListItemDetails(place,null,"createPage");
        }
        else if (page=="indexPage")
        {
          var detailsContainer = createListItemDetails(place,myEvent,"indexPage");
        }
        parentNode.appendChild(detailsContainer);
      } else {
        //adds extra 100ms timeout on second setPlaceDetails call
        setTimeout(function() {
          setPlaceDetails(pid, parentNode,myEvent,page);
        }, 100);
      }
  });
}

//creates elements for list item details
//*stores all location data from getDetails in h3 header (used for filling out data in form)*
function createListItemDetails(place,myEvent,page) {

  //create details container
  var container = document.createElement("div");
  container.setAttribute("class", "location details container");

  //create h3 header and stores all locations details as data for future reference
  var placeHeader = document.createElement("h3");
  if (page=="createPage")
  {
    $(placeHeader).data('locationData', { location_name: place.name, location_address: place.vicinity, 
    lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), place_id: place.place_id });
    $(placeHeader).append(place.name);
  }
  else if (page=="indexPage")
  {
    $(placeHeader).append(myEvent.name);
  }
  //append h3 header
  container.appendChild(placeHeader);
  container.appendChild(document.createElement("br"));

  //create main details for index page
  //if any data is undefined the elements are not created
  if (page=="indexPage")
  {
    //add location name info
    if(place.name !== undefined) {
      container.appendChild(document.createTextNode("Location: "+place.name));
      container.appendChild(document.createElement("br"));
    }

    //add address info
    if(place.formatted_address !== undefined) {
      container.appendChild(document.createTextNode("Address: "+place.formatted_address));
      container.appendChild(document.createElement("br"));
    }
    //add start time info
    if(myEvent.start_time !== undefined) {
      var start_time = moment.utc(myEvent.start_time).format('MMMM Do YYYY, h:mm a');
      var time_zone = moment().tz(String(myEvent.timeZoneId)).format('z');
      container.appendChild(document.createTextNode("Start Time: "+start_time + " " + time_zone));
      container.appendChild(document.createElement("br"));
    }

    //add endtime info
    if(myEvent.end_time !== undefined) {
      var end_time = moment.utc(myEvent.end_time).format('MMMM Do YYYY, h:mm a');
      var time_zone = moment().tz(String(myEvent.timeZoneId)).format('z');
      container.appendChild(document.createTextNode("End Time: "+end_time  + " " + time_zone));
      container.appendChild(document.createElement("br"));
    }

    //add link to show event 
    if(myEvent.id !== undefined) {
      //var text = document.createTextNode("Website: ");
      //container.appendChild(text);
      var link = document.createElement("a");
      link.setAttribute("href","/events/" + myEvent.id);
      link.appendChild(document.createTextNode("Show"));
      container.appendChild(link);
      container.appendChild(document.createElement("br"));
    }
  }
  else if (page=="createPage")
  {
    //add address info
    if(place.formatted_address !== undefined) {
      container.appendChild(document.createTextNode("Address: "+place.formatted_address));
      container.appendChild(document.createElement("br"));
    }
    //add website info
    if(place.website !== undefined) {
      var text = document.createTextNode("Website: ");
      container.appendChild(text);
      var link = document.createElement("a");
      link.setAttribute("href",place.website);
      link.appendChild(document.createTextNode(place.website));
      container.appendChild(link);
      container.appendChild(document.createElement("br"));
    }
    //add rating info
    if(place.rating !== undefined) {
      container.appendChild(document.createTextNode("Rating: "+place.rating+"/5"));
      container.appendChild(document.createElement("br"));
    }
    //add phone number info
    if(place.formatted_phone_number !== undefined) {
      container.appendChild(document.createTextNode("Phone number: "+place.formatted_phone_number));
      container.appendChild(document.createElement("br"));
    }
  }

  return container;
}

//creates the show list button if not present and
//sets the default text to show list if already created 
function createShowListButton (){
  if($("#show-list-toggle").length === 0){
    var showListButton = "<a id='show-list-toggle' class='btn btn-info center-block' onclick='toggleList()'>Show List</a>";
    $("#locationDetails").prepend(showListButton);
  }else{
    $("#show-list-toggle").text("Show List");
  }
}

//fills form data on create event page using json data
function fillForm(data, timeZoneData){
  $("#event_place_name").val(data.location_name);
  $("#event_place_address").val(data.location_address);
  $("#lat").val(data.lat);
  $("#lng").val(data.lng);
  $("#place_id").val(data.place_id);
  $("#dstOffset").val(timeZoneData.dstOffset);
  $("#rawOffset").val(timeZoneData.rawOffset);
  $("#timeZoneId").val(timeZoneData.timeZoneId);
  $("#timeZoneName").val(timeZoneData.timeZoneName);
}

//hides/shows list and changes button text
function toggleList() {
    var list = document.getElementById("resultsList");

    if (list.style.display == "none"){
        list.style.display = "block";
        $("#show-list-toggle").text("Hide List");
    }else{
        list.style.display = "none";
        $("#show-list-toggle").text("Show List");
    }
}

;
