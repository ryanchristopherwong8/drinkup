function renderList(results) {
    var numberResultsToReturn = results.length<8 ? results.length : 8;
    for(var i = 0; i < numberResultsToReturn; i++){
        var addressListItem = document.createElement('li'); 
        addressListItem.setAttribute("class", "location-item");
        //use jquery to store data 
        $(addressListItem).data('locationData', { location_name: results[i].name, location_address: results[i].vicinity, 
            lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng(), place_id: results[i].place_id });
        addressListItem.appendChild(document.createTextNode(results[i].name));
        addressListItem.appendChild(document.createTextNode(", " + results[i].vicinity));

        var button = document.createElement("button");
        button.setAttribute("class", "btn-location-add btn btn-primary glyphicon glyphicon-plus");

        $(button).click(function(){
            var parentNode = this.parentNode;
            //use jquery to get data
            var locationData = $(parentNode).data("locationData")
            fillForm(locationData);
            
        });      
        addressListItem.appendChild(button);
        resultsList.appendChild(addressListItem);
    }
}

function createShowListButton (){
  var child = $("#locationDetails").firstChild;
  if($("#show-list-toggle").length === 0){
    var showListButton = "<button id='show-list-toggle' onclick = 'showList()'>show list</button>";
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

function showList() {
    var list = document.getElementById("resultsList");

    if (list.style.display == "none"){
        list.style.display = "block";
    }else{
        list.style.display = "none";
    }
}

