// Call the dataTables jQuery plugin
$(document).ready(function() {
    console.log("run")
    $('#dataTable').dataTable({
        paging:false,
        ordering:false
    });

    $("#dataTable_wrapper div div:nth-child(2)").removeClass('col-md-6').addClass('col-md-12')
    $('.form-control-sm').css('text-align' , 'center')

    

  

  
  });

  