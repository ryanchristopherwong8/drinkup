$(document).ready(function(){
  initAutocomplete();
  initMap(49.2667967,-123.2056314,10, "create");
  getUserLocation();
  $("#barSelector").attr("onclick","setDrinktype('bar')");
  $("#cafeSelector").attr("onclick","setDrinktype('cafe')");

	$(document).on("click", ".list-group-item", function(event) {
		var locationData =  $(this).find("h3").data("locationData");
		var placeHeader = $(this).find("h3");
		var listItem = this;

		getTimeZoneDataForPlace(locationData.lat, locationData.lng).then(function (data) {

			$(placeHeader).data('timeZoneData', { dstOffset: data.dstOffset, rawOffset: data.rawOffset, timeZoneId: data.timeZoneId, 
				timeZoneName: data.timeZoneName 
			});
			setActiveListItem(listItem);
		});
	});
 });

function getTimeZoneDataForPlace(lat, lng) {
  var timestamp = Date.now() / 1000;
  var url = "https://maps.googleapis.com/maps/api/timezone/json?location="+ lat +","+ lng + "&timestamp="+ timestamp +"&key=AIzaSyAZdA5AE3hXH5bcskGACiNQhGtvxJ0e7r8";

  return $.getJSON(url);
}

function setActiveListItem(element) {
  toggleList();
  $(".list-group-item").removeClass("active");
  element.classList.add("active");
  var locationData = $(element).find("h3").data("locationData");
  var timeZoneData = $(element).find("h3").data("timeZoneData");
  fillForm(locationData, timeZoneData);
}