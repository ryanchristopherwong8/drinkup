$(document).ready(function(){
  var start_time = $("#drinkup_start_time").text();
  var end_time = $("#drinkup_end_time").text();

  var formatted_start_time = formatTime(start_time);
	var formatted_end_time = formatTime(end_time);

	$("#drinkup_start_time").text(formatted_start_time);
	$("#drinkup_end_time").text(formatted_end_time);
});

function formatTime(unformatted_time) {
	var formatted_time = moment.utc(unformatted_time).format('MMMM Do YYYY, h:mm a');
	return formatted_time;
}