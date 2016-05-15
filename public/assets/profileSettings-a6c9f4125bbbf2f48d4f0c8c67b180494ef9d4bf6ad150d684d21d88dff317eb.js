$(document).ready(function(){
     $('#passwordInput').keyup(function(){
          if ($(this).val() == '') { 
               $('.btn-settings').prop('disabled', true);
          } else {
               $('.btn-settings').prop('disabled', false);
          }
     });
});
