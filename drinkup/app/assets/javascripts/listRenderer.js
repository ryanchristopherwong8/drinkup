function renderListWithPhotos(results){
  var numberResultsToReturn = results.length<8 ? results.length : 8;
  for(var i = 0; i < numberResultsToReturn; i++){

    var addressListItem = document.createElement('li'); 

    var image = document.createElement("img");
    var pid = results[i].place_id;

    var photos = results[i].photos;
    if(photos){
      var photoSource = photos[0].getUrl({'maxWidth': 50, 'maxHeight': 50});
      image.setAttribute("src",photoSource);
    }

    addressListItem.appendChild(image);
    setPlaceDetails(pid, addressListItem);
    $("#resultsList").append(addressListItem);
  }
}

function setPlaceDetails(pid, parentNode){
  service.getDetails({
    placeId: pid
    }, 
    function(place, status, result) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var link = createListItemDetails(place);
        parentNode.appendChild(link);
      }
  });
}

function createListItemDetails(place) {
  var container = document.createElement("div");
  container.setAttribute("class", "list-item details");
  var link = document.createElement("a");

  $(link).data('locationData', { location_name: place.name, location_address: place.vicinity, 
    lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), place_id: place.place_id });
  
  $(link).click(function(){
    var locationData = $(this).data("locationData")
    fillForm(locationData);
  });      

  link.appendChild(document.createTextNode(place.name));
  link.appendChild(document.createElement("br"));
  link.appendChild(document.createTextNode(place.formatted_address));
  link.appendChild(document.createElement("br"));
  link.appendChild(document.createTextNode(place.website));
  link.appendChild(document.createElement("br"));
  link.appendChild(document.createTextNode(place.rating));
  link.appendChild(document.createElement("br"));
  link.appendChild(document.createTextNode(place.formatted_phone_number));
  link.appendChild(document.createElement("br"));
  container.appendChild(link);
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

