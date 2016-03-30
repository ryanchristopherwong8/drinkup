function renderList(results) {
    var numberResultsToReturn = results.length<8 ? results.length : 8;
    for(var i = 0; i < numberResultsToReturn; i++){
        var addressListItem = document.createElement('li'); 
        addressListItem.setAttribute("class", "location-item");
        //use jquery to store data 
        $(addressListItem).data('locationData', { location_name: results[i].name, location_address: results[i].vicinity, 
            lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng(), place_id: results[i].place_id });
        addressListItem.appendChild(document.createTextNode(results[i].name));
        addressListItem.appendChild(document.createTextNode(results[i].vicinity));

        var button = document.createElement("button");
        button.setAttribute("id", "location-"+i);
        button.setAttribute("class", "btn-location-add btn btn-primary glyphicon glyphicon-plus");

        $(button).click(function(){
            var parentNode = this.parentNode;
            //use jquery to get data
            var locationData = $(parentNode).data("locationData")
            //setting 
            $("#event_location_name").val(locationData.location_name);
            $("#event_location_address").val(locationData.location_address);
            $("#lat").val(locationData.lat);
            $("#lng").val(locationData.lng);
            $("#place_id").val(locationData.place_id);
        });      
        addressListItem.appendChild(button);
        resultsList.appendChild(addressListItem);
        //create list elements 
        /*
        var addressListItem = document.createElement('li'); 
        addressListItem.setAttribute("class", "location-item");
        addressListItem.setAttribute("name", results[i].name);
        addressListItem.setAttribute("lat", lat);
        addressListItem.setAttribute("lng", lng);
        addressListItem.appendChild(document.createTextNode(results[i].vicinity));

        var button = document.createElement("button");
        button.setAttribute("id", "location-"+i);
        button.setAttribute("class", "btn-location-add btn btn-primary glyphicon glyphicon-plus");

        $(button).click(function(){
            var parentNode = this.parentNode;
            var test = $("#event_place_name");
            $("#event_place_name").val(parentNode.getAttributeNode("name").value);
            $("#event_place_address").val(parentNode.textContent);
            $("#lat").val(parentNode.getAttributeNode("lat").value);
            $("#lng").val(parentNode.getAttributeNode("lng").value);
            //alert("lat is: " + myparent.lat + " long is: " + myparent.lng);
        });      
        addressListItem.appendChild(button);
        resultsList.appendChild(addressListItem);
        */
    }
}