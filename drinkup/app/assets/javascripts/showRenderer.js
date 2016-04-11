$(document).ready(function(){

    getTopConversations(gon.event_id).then(function (data) {
    	var topConversations = data.top_conversations;
    	var conversationTagsHTML = "";
	    $.each(topConversations, function(key, value){
	      var conversationSpan = "<span class='conversation_tag selected'>" + value + "</span>";
	      conversationTagsHTML += conversationSpan;
	    });
	    $("#drinkup_conversations").html(conversationTagsHTML);
    });

});