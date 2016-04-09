function renderListWithPhotos(results,flag){
  var numberResultsToReturn = results.length<8 ? results.length : 8;
  for(var i = 0; i < numberResultsToReturn; i++){

    var locationListItem = document.createElement('li');
    locationListItem.setAttribute("class", "list-group-item location listItem");
    if (flag==1)
    {
      locationListItem.setAttribute("onclick", "setActiveListItem(this)");
    }
    

    var itemContainer = document.createElement('div');
    itemContainer.setAttribute("class", "location container");
    var pid = results[i].place_id;
    if (flag==1)
    {
      createLocationImage(results[i], itemContainer);
      setPlaceDetails(pid, itemContainer,null,1); 
    }
    else if (flag==0)
    {
      setPlaceDetails(pid, itemContainer,results[i],0); 
    }
    

    var pid = results[i].place_id;
       
    locationListItem.appendChild(itemContainer);    
    $("#resultsList").append(locationListItem).attr("class","list-group well").height("250px");
  }
}

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

function setPlaceDetails(pid, parentNode,myEvent,flag){
  service.getDetails({
    placeId: pid
    }, 
    function(place, status, result) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (flag==1)
        {
          var detailsContainer = createListItemDetails(place,null,1);
        }
        else if (flag==0)
        {
          var detailsContainer = createListItemDetails(place,myEvent,0);
        }
        parentNode.appendChild(detailsContainer);
      }
  });
}

function setActiveListItem(element) {
      toggleList();
      $(".list-group-item").removeClass("active");
      element.classList.add("active");
      var locationData = $(".active").find("h3").data("locationData");
      fillForm(locationData);
}

function createListItemDetails(place,myEvent,flag) {
  var container = document.createElement("div");
  container.setAttribute("class", "location details container");
  var placeHeader = document.createElement("h3");

  $(placeHeader).data('locationData', { location_name: place.name, location_address: place.vicinity, 
    lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), place_id: place.place_id });
  
  if (flag==1)
  {
    $(placeHeader).append(place.name);
  }
  else if (flag==0)
  {
    $(placeHeader).append(myEvent.name);
  }
  

  container.appendChild(placeHeader);
  container.appendChild(document.createElement("br"));

  if (flag==0)
  {
    if(place.name !== undefined){
      container.appendChild(document.createTextNode("Location: "+place.name));
      container.appendChild(document.createElement("br"));
    }

    if(place.formatted_address !== undefined){
      container.appendChild(document.createTextNode("Address: "+place.formatted_address));
      container.appendChild(document.createElement("br"));
    }

    if(myEvent.start_time !== undefined){
      var start_time = moment.utc(myEvent.start_time).format('MMMM Do YYYY, h:mm a');
      container.appendChild(document.createTextNode("Start Time: "+start_time));
      container.appendChild(document.createElement("br"));
    }

    if(myEvent.end_time !== undefined){
      var end_time = moment.utc(myEvent.end_time).format('MMMM Do YYYY, h:mm a');
      container.appendChild(document.createTextNode("End Time: "+end_time));
      container.appendChild(document.createElement("br"));
    }
  }
  else if (flag==1)
  {
    if(place.formatted_address !== undefined){
      container.appendChild(document.createTextNode("Address: "+place.formatted_address));
      container.appendChild(document.createElement("br"));
    }
    if(place.website !== undefined){
      var text = document.createTextNode("Website: ");
      container.appendChild(text);
      var link = document.createElement("a");
      link.setAttribute("href",place.website);
      link.appendChild(document.createTextNode(place.website));
      container.appendChild(link);
      container.appendChild(document.createElement("br"));
    }
    if(place.rating !== undefined){
      container.appendChild(document.createTextNode("Rating: "+place.rating+"/5"));
      container.appendChild(document.createElement("br"));
    }
    if(place.formatted_phone_number !== undefined){
      container.appendChild(document.createTextNode("Phone number: "+place.formatted_phone_number));
      container.appendChild(document.createElement("br"));
    }
  }

  return container;
}

function createShowListButton (){
  var child = $("#locationDetails").firstChild;
  if($("#show-list-toggle").length === 0){
    var showListButton = "<a id='show-list-toggle' onclick = 'toggleList()'>Hide List</a>";
    $("#locationDetails").prepend(showListButton);
  }
}

function fillForm(data){
  $("#event_location_name").val(data.location_name);
  $("#event_location_address").val(data.location_address);
  $("#lat").val(data.lat);
  $("#lng").val(data.lng);
  $("#place_id").val(data.place_id);
}

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

