$(document).ready(function(){
    var chatbox = $(".chatboxcontent");
    chatbox.scrollTop(chatbox[0].scrollHeight);

    setEnterKeyForChatBoxTextArea();
});

function setEnterKeyForChatBoxTextArea(){
	$('.chatboxtextarea').keypress(function(e){
	    if(e.which == 13){
	    	//prevent default behavior of enter
	    	event.preventDefault();
	       //send form
	       $(this).closest('form').submit();
	       //clear text area
	       $(this).val('');
	    }
	});
}
