/* todo:
   make input[type=text] configurable!!!!
   
  
    use data-td-type: number|string|date
    use data-td-input: true|false (default is false)
    
    use data-cell|table|??
   
*/

  function filter(selector, query) {  
    query =   $.trim(query); //trim white space  
    query = query.replace(/ /gi, '|'); //add OR for regex query  
    
    $(selector).each( function() {      
      
      var text = "| ";
      var $inputs = $( 'input[type=text]', this );

      if( $inputs.length == 0 )
      {
        $( 'td', this ).each( function() {
         text += $(this).text() + " |";
        });
      }      
      else
      {
        $inputs.each( function() {
         text += $(this).val() + " |";
        });
      }
      
      // console.log( "[debug] text: " + text );
      
      if( text.search( new RegExp(query, 'i')) < 0 ) {  
          $(this).hide().removeClass('visible')  
      } else {  
          $(this).show().addClass('visible');  
      }      
    });  
  }    
  
  $(document).ready(function() {
    $('table tr.row').hover(function(){  
       $(this).find('td').addClass('hovered');  
     }, function(){  
       $(this).find('td').removeClass('hovered');  
     });
  
  //default each row to visible  
  $('table tr.row').addClass('visible');  

  $('#filter').keyup( function(event) {  
    //if esc is pressed or nothing is entered  
    if( event.keyCode == 27 || $(this).val() == '' ) {  
      //if esc is pressed we want to clear the value of search box  
      $(this).val('');  
      //we want each row to be visible because if nothing  
      //is entered then all rows are matched.  
      $('table tr.row').removeClass('visible').show().addClass('visible');  
    }  
    //if there is text, lets filter  
    else {  
      filter('table tr.row', $(this).val());  
    }    
  });
  
  
   $('thead tr.sortable td').each( function( columnIndex ) {
    if( $(this).is( '.sortable' ) )
    {

      // console.log( "sortable["+columnIndex+"]" );      
      
      $(this).click( function() {
      
         // console.log( "onclick sortable["+columnIndex+"]");
         
         var findSortKey = function( $cell ) {
           return $cell.find( 'input[type=text]' ).val();
         }
      
         var sortDirection = $(this).is( '.sorted-asc' ) ? -1 : 1;
      
         // table > thead > tr > td
         var $rows = $(this).parent().parent().parent().find( 'tr.row.sortable' );
         
         // console.log( $rows );

         $.each( $rows, function( index, row ) {
            row.sortKey = findSortKey( $(row).children( 'td' ).eq( columnIndex ) );
            // console.log( "["+index+"]" + row.sortKey );
         });
         
        $rows.sort( function( left, right ) {
          if( left.sortKey < right.sortKey ) return -sortDirection;
          if( left.sortKey > right.sortKey ) return sortDirection;
          return 0;
          });
        
        $.each( $rows, function( index, row ) {
          $( 'tbody' ).append( row );
          row.sortKey = null;
        });
        
        $('thead tr.sortable td').removeClass( 'sorted-asc sorted-desc' );
        sortDirection == 1 ? $(this).addClass( 'sorted-asc' ) : $(this).addClass( 'sorted-desc' );
        
   }); 
    }
   });
   
  
  }); // document.ready