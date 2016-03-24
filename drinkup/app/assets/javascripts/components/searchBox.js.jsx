var searchBox = React.createClass({
	getInitialState: function() {
		return {submitted : false}
	},
	submit: function(searchtype) {
		this.setState({submitted : true});
		var drinks;
		drinks = document.getElementById("searchinput").value;
		$.ajax({
			url: "/showmap/?searchtype="+drinks,
			type: "post",
			data: searchtype,
			success: function(){
        alert('Saved Successfully');
      },
      error:function(){
       alert('Error');
      }
		});
	},
	render: function() {
		return (
			<div className="ui action input">
 			 	<input id="searchinput" type="text location-search" refs="" placeholder="Search..."></input>
  			<button className="ui button" onClick={this.submit}>Search</button>
			</div>
		)
	}
})