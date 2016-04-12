 $(document).ready(function(){

  //Get and format today's date
  function todaysDate() {
    currDay = new Date;
    var dd = currDay.getDate();
    var mm = currDay.getMonth() + 1;
    var yyyy = currDay.getFullYear();
    if (mm < 10) {
      mm = "0" + mm;
    }
    return yyyy+'/'+mm+'/'+dd;
  }

  //Previous times are not able to be selected if current day is selected.
  function adjustTime(thisPicker) {
    var userDate = todaysDate();
    var splitedate = $(thisPicker).val().split(" ");
    if (splitedate[0] == userDate) {
      return 0; 
    }
    else {
      return'00:00';
    };
  }

   jQuery(function(){
      var currentDate = 0;  //Keep track of date to sync both date pickers
      jQuery.datetimepicker.setLocale('en');

      $('#date_timepicker_start').change(function(){
          if ($(this).val() == '') { 
               $('#date_timepicker_end').val("");
               $('#date_timepicker_end').prop('disabled', true);

          } else {
               $('#date_timepicker_end').prop('disabled', false);
          }
      });

      jQuery('#date_timepicker_start').datetimepicker({
        onSelectDate:function(ct){
          var ptime = adjustTime('#date_timepicker_start');
          this.setOptions({
            minTime: ptime
          })
        },
      onShow:function( ct ){
       this.setOptions({
        maxDate:jQuery('#date_timepicker_end').val()?jQuery('#date_timepicker_end').val():false
       })
      },
      minDate:0,
      timepicker:true,
      scrollMonth:false,
      scrollTime:false,
      scrollInput:false,
      allowTimes:[
      '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', 
      '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
      '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', 
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', 
      '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', 
      '21:00', '21:30', '22:00', '22:30', '23:00', '23:30' 
     ]


     });
     jQuery('#date_timepicker_end').datetimepicker({
      onSelectDate:function(ct){
          var ptime = adjustTime('#date_timepicker_end');
          this.setOptions({
            minTime: ptime
          })
        },
      onShow:function( ct ){
       this.setOptions({
        minDate:jQuery('#date_timepicker_start').val()?jQuery('#date_timepicker_start').val():false
       })
      },
      timepicker:true,
      scrollMonth:false,
      scrollTime:false,
      scrollInput:false,
      allowTimes:[
      '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', 
      '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
      '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', 
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', 
      '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', 
      '21:00', '21:30', '22:00', '22:30', '23:00', '23:30' 
     ]
     });
  });
});