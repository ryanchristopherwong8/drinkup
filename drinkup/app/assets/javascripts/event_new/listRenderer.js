function renderList(results) {
    var numberResultsToReturn = results.length<8 ? results.length : 8;
    for(var i = 0; i < numberResultsToReturn; i++){
        var addressListItem = document.createElement('li'); 
        var link = document.createElement("a");

        addressListItem.setAttribute("class", "location-item");

        $(link).data('locationData', { location_name: results[i].name, location_address: results[i].vicinity, 
            lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng(), place_id: results[i].place_id });
        link.appendChild(document.createTextNode(results[i].name));
        link.appendChild(document.createTextNode(", " + results[i].vicinity));

        $(link).click(function(){
            var locationData = $(this).data("locationData")
            fillForm(locationData);
        });      
        
        addressListItem.appendChild(link);
        resultsList.appendChild(addressListItem);
    }
}

function createShowListButton (){
  var child = $("#locationDetails").firstChild;
  if($("#show-list-toggle").length === 0){
    var showListButton = "<a id='show-list-toggle' onclick = 'toggleList()'>Hide List</button>";
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

