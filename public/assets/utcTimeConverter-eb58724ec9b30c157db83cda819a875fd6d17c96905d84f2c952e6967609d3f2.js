$(document).ready(function(){

  /* Displays a drinkup start and end time in the time the user picked + the time zone of where the drinkup is located */
  var start_time = $("#drinkup_start_time").text();
  var end_time = $("#drinkup_end_time").text();
  var time_zone = $("#start_time_zone").text();

  var formatted_start_time = formatTime(start_time);
  var formatted_end_time = formatTime(end_time);
  var formatted_time_zone = moment().tz(String(time_zone)).format('z');

	$("#drinkup_start_time").text(formatted_start_time);
	$("#drinkup_end_time").text(formatted_end_time);
	$("#start_time_zone").text(formatted_time_zone);
	$("#end_time_zone").text(formatted_time_zone);
});

function formatTime(unformatted_time) {
	var formatted_time = moment.utc(unformatted_time).format('MMMM Do YYYY, h:mm a');
	return formatted_time;
}
