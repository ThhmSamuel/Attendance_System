// =============  Data Table - (Start) ================= //

$(document).ready(function(){
    
    var table = $('#example').DataTable({
        
        buttons:['copy', 'csv', 'excel', 'pdf', 'print']
        
    }); 

    var table2 = $('#example2').DataTable({
        
        buttons:['copy', 'csv', 'excel', 'pdf', 'print']
        
    }); 

    var table3 = $('#example3').DataTable({
        
        buttons:['copy', 'csv', 'excel', 'pdf', 'print']
        
    });
     
    
    table.buttons().container() 
    .appendTo('#example_wrapper .col-md-6:eq(0)'); 

    table2.buttons().container() 
    .appendTo('#example2_wrapper .col-md-6:eq(0)');

    table3.buttons().container() 
    .appendTo('#example3_wrapper .col-md-6:eq(0)'); 


});

// =============  Data Table - (End) ================= // 