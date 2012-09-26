/* todo:
   make input[type=text] configurable!!!!
   
  
    use data-td-type: number|string|date
    use data-td-input: true|false (default is false)
    
    use data-cell|table|??
    
    add support for date
    add icons for up and down
    
    
    ***** uses stable merge sort or use pos hack on equal
    *****  add to docu
   
*/
  
  function table_hovered( table_rows_selector )
  {
    $( table_rows_selector ).hover(function(){  
       $(this).find('td').addClass('hovered');  
     }, function(){  
       $(this).find('td').removeClass('hovered');  
     });
  }



  // todo: rename to table_filter_worker or similar?
  
  // todoL use keyfunc like in table_sorter  
  
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

  function table_filter( filter_id, table_rows_selector )
  {
    //default each row to visible  
    $( table_rows_selector ).addClass('visible');  

    $( filter_id ).keyup( function(event) {  
    //if esc is pressed or nothing is entered  
    if( event.keyCode == 27 || $(this).val() == '' ) {  
      //if esc is pressed we want to clear the value of search box  
      $(this).val('');  
      //we want each row to be visible because if nothing  
      //is entered then all rows are matched.  
      $( table_rows_selector ).removeClass('visible').show().addClass('visible');  
    }  
    //if there is text, lets filter  
    else {  
      filter( table_rows_selector, $(this).val());  
    }    
    });
  }
  
  function table_sorter( table_id )
  {
    var sortFuncs = {
          "int"    : function(left,right) { return left - right; },
          "float"  : function(left,right) { return left - right; },
          "string" : function(left,right) { if (left<right) return -1; if (left>right) return 1; return 0;}
        };    

    // NB: use replace( /,/g, '' ) for numbers (remove , lets you use 123,444,444 instead of 123444444 )
    // convert from text to data type
    var convFuncs = {
          "int"    : function(text) { return parseInt( text.replace( /,/g, ''), 10); },
          "float"  : function(text) { return parseFloat( text.replace( /,/g, '')); },
          "string" : function(text) { return text; }
      };    
    
    var keyFuncs = {
          "input" : function( $cell ) { return $cell.find('input[type=text]').val(); },
          "text":   function( $cell ) { return $cell.text(); }
        };

    $( table_id + ' thead tr.sortable td').each( function( columnIndex ) {

    if( $(this).is( '.sortable' ) )
    {
      // console.log( "sortable["+columnIndex+"]" );      

      $(this).click( function() {
      
         // console.log( "onclick sortable["+columnIndex+"]");
    
         var keyType = $(this).data( 'input' );
         if( keyType === true )
           keyType = 'input';
         else
           keyType = 'text';

         var sortType = $(this).data( 'type' );
         if( sortType === undefined )
           sortType = 'string';
    
         // console.log( "keytype: " + keyType + ", sortType: " + sortType ); 
    
         var keyFunc  = keyFuncs[ keyType ];
         var convFunc = convFuncs[ sortType ];
         var sortFunc = sortFuncs[ sortType ];      
      
         var sortDirection = $(this).is( '.sorted-asc' ) ? -1 : 1;
      
         // table > thead > tr > td
         var $rows = $(this).parent().parent().parent().find( 'tr.row.sortable' );
         
         // console.log( $rows );

         $.each( $rows, function( index, row ) {
            row.sortKey = convFunc( keyFunc( $(row).children( 'td' ).eq( columnIndex ) ));
            row.sortPos = index;   // NB: stable sort hack, part i - on equal use sortPos to keep stable sort with unstable sort
            // console.log( "["+index+"]" + row.sortKey );
         });
         
        $rows.sort( function( left, right ) {
          var result = sortFunc( left.sortKey, right.sortKey );

          if( sortDirection == -1 )
            result = -result;
          
          // NB: stable sort hack, part ii
          if( result == 0 )
            result = left.sortPos - right.sortPos;
            
          return result;
        });
        
        $.each( $rows, function( index, row ) {
          $( table_id + ' tbody' ).append( row );
          // row.sortKey = null;
          // row.sortPos = null;
        });
        
        $( table_id + ' thead tr.sortable td').removeClass( 'sorted-asc sorted-desc' );
        sortDirection == 1 ? $(this).addClass( 'sorted-asc' ) : $(this).addClass( 'sorted-desc' );
   }); 
    }
   });
  }