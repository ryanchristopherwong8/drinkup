var map;
var autocomplete;
var service;
var postionOfUserFromGeolocation=new Array;
var drinktype='cafe'
var infowindow;
var bounds;

var searchresultsJSON;
var address = new Array() ;

function setDrinktypeCafe() {
  drinktype = 'cafe'
}

function setDrinktypeBar() {
  drinktype = 'bar'
}

function getUserLocation()
{
	if (navigator.geolocation) 
	{
		var options={timeout:30000};
        navigator.geolocation.getCurrentPosition(storePosition,getManualLocation,options);
    } 
}

function storePosition(position) {
	postionOfUserFromGeolocation[0]=position.coords.latitude;
	postionOfUserFromGeolocation[1]=position.coords.longitude;
	changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
  setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000,drinktype);
}

function getManualLocation(error) {
	//generate message that location could not be got
  document.getElementById('error').innerHTML="Could Not Get Geolocation";
} 

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', storePositionFromGoogleAPI);
}

function initMap(lat_user,lng_user,zoom) {
  var user_location = {lat:lat_user , lng:lng_user};

  map = new google.maps.Map(document.getElementById('map'), {
      center: user_location,
      zoom: zoom
        });
  service = new google.maps.places.PlacesService(map);
  infowindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();
      }

function changeMapLocation(lat_user,lng_user,zoom)
{
	var user_location = {lat:lat_user , lng:lng_user};
	map.setCenter(user_location);
  map.setZoom(zoom);
}

function storePositionFromGoogleAPI()
{
	var place = autocomplete.getPlace();
	postionOfUserFromGeolocation[0]=place.geometry.location.lat();
	postionOfUserFromGeolocation[1]=place.geometry.location.lng();
	changeMapLocation(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],15);
  setup(postionOfUserFromGeolocation[0],postionOfUserFromGeolocation[1],1000, drinktype);
}

function setup(lat_user,lng_user,radius,drinktype)
{
  document.getElementById('error').innerHTML="";
  var user_location = {lat:lat_user , lng:lng_user};
  
   var request = {
    location: user_location,
    radius: radius,
    types: [drinktype]
  };
  
  service.nearbySearch(request, callback);
}
/*
function listResults() 
{
  for (var i = 0; i < searchresultsJSON.results.length; i++) 
  {
    address[i] = searchresultsJSON.results[i].formatted_address;
    console.log(address[i]);
  }

  var resultsContent = document.getElementById("resultsContent");
  resultsContent.setAttribute("align", center);

  var resultsList=document.createElement("ol");
  for (var i = 0; i < address.length; i++)
  {
    var addressItem = document.createElement("li");
    resultsList.appendChild(addressItem);
  }
}
*/
function callback(results, status) {
        var numberResultsToReturn=results.length;
        var resultsList = document.getElementById("resultsList");
        if (results.length>8)
        {
          numberResultsToReturn=8;
        }
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < numberResultsToReturn; i++) {
            var lat=results[i].geometry.location.lat();
            var lng=results[i].geometry.location.lng();
            bounds.extend(new google.maps.LatLng(lat, lng));
            createMarker(results[i],(i+1));

            // doesnt work because needs to be detailed address[i] = results[i].formatted_address;
            console.log(results[i].name);

            var entry = document.createElement('li');
            entry.appendChild(document.createTextNode(results[i].name));
            console.log(entry);
            resultsList.appendChild(entry);
          }
        }
        map.fitBounds(bounds);
      }


function createMarker(place,number) {
        var image='http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+number+'|FE6256|000000';
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: image
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }