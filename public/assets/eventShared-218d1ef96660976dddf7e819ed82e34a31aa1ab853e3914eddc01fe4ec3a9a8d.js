function getTopConversations(drinkupId) {
    return $.ajax({
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      url: "/events/"+drinkupId+"/getTopConversations"
    });
}
