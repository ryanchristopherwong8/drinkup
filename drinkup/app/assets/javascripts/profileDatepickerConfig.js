  $(document).ready(function(){
  	//Current year for max year.
	 var d = new Date();
	 var n = d.getFullYear(); 
	 jQuery('#profileDatepicker').datetimepicker({
	 yearStart:1915,
	 yearEnd:n,
	 timepicker:false,
	 scrollMonth:false,
     scrollInput:false,
	 format:'Y/m/d'
	});
});