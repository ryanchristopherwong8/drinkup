$(document).ready(function(){
	
	var conversationDiv = $("#conversation_select");
	var conversationLink = $("#conversation_link");

  	conversationDiv.hide();

	conversationLink.on("click", function(e) {
		e.preventDefault();
		if (!conversationDiv.is(":visible") && conversationDiv.is(":empty")) {
			loadConversations();
		}
		conversationDiv.slideToggle(200);
	});

	$(document).on("click", "#conversation_select .conversation_tag", function(e) {
		if (!$(this).hasClass("selected")) {
			$(this).addClass("selected");
			saveConversations($(this).text());
		} else {
			$(this).removeClass("selected");
			removeConversations($(this).text(), e);
		}

	});
	$(document).on("click", "#info", function(e) {
		$('[data-toggle="tooltip"]').tooltip();
	});
});

function loadConversations() {

	var conversationDiv = $("#conversation_select");

	$.getJSON("/users/getConversations", function (data) {

		var conversations = data.conversations;
		$.each(conversations, function(key, value) {
			if ($.inArray(value, gon.conversations) !== -1) {
				conversationDiv.append("<span class='conversation_tag selected'>" + value + "</span>");
			}
			else {
				conversationDiv.append("<span class='conversation_tag'>" + value + "</span>");
			}
		});
	});
}

function saveConversations(conversation) {
	$.ajax({
		type: "POST",
		url: "/users/"+gon.user_id+"/saveConversations",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
		data: JSON.stringify({conversation: conversation}),
		success: function(data) {
			if (data.success) {
				$("#user_conversations").append("<span class='conversation_tag'>" + conversation + "</span>");
			}
		}
	});
}

function removeConversations(conversation, event) {
	$.ajax({
		type: "DELETE",
		url: "/users/"+gon.user_id+"/removeConversations",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
		data: JSON.stringify({conversation: conversation}),
		success: function(data) {
			if (data.success) {
				conversation_name = $(event.target).text();
				$("#user_conversations .conversation_tag:contains('"+conversation_name+"')").remove();
			}
		}
	});
}