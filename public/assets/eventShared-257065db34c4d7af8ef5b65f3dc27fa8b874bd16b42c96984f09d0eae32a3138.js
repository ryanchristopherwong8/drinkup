function getTopConversations(drinkupId) {
    return $.ajax({
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      url: "/events/"+drinkupId+"/getTopConversations"
    });
}

function joinEvent(drinkupId) {
	$.ajax({
		type: "POST",
		url: "/events/" + drinkupId + "/join",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({drinkupId: drinkupId}),
		success: function(data) {
			window.location.href = "/events/" + drinkupId;
		},
		error: function(data) {
			console.log(error);
		}
	});
}

function unjoinEvent(drinkupId) {
	$.ajax({
		type: "POST",
		url: "/events/" + drinkupId + "/unjoin",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({drinkupId: drinkupId}),
		success: function(data) {
			window.location.href = "/events/" + drinkupId;
		},
		error: function(data) {
			console.log(error);
		}
	});
}
;
