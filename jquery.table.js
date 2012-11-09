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


    var keyFuncs = {
          "input" : function( $cell ) { return $cell.find('input[type=text]').val(); },
          "text":   function( $cell ) { return $cell.text(); },
          "void":   function( $cell ) { return ''; }
        };
  
  
  
  function table_filter_worker( $rows, query, keyFuncMap ) {  
    query =   $.trim(query); //trim white space  
    query = query.replace(/ /gi, '|'); //add OR for regex query  

    var regex = new RegExp(query, 'i');
    
    $rows.each( function() {      
      var text = "| ";
      $(this).find( 'td' ).each( function( index ) {
        text +=  keyFuncMap[index]( $(this) ) + " |";
      } );      
      
      // console.log( "[debug] text: " + text );
      
      if( text.search( regex ) < 0 ) {  
          $(this).hide().removeClass('visible')  
      } else {  
          $(this).show().addClass('visible');  
      }
    });  // each row
  }    

  function table_filter( filter_id, table_id )
  {    
    var $table = $( table_id );

    // build keyFuncMap for/from columns
    var keyFuncMap = [];
    
    // NB: by default use :last (if more than one table header row; only use the last one)
    $table.find( 'thead tr:last th' ).each( function( columnIndex ) {

      // NB: lets you use data-filter=false to make column NOT filterable
     var filterable = $(this).data( 'filter' );
     if( filterable === undefined )
       filterable = true;
    
     if( filterable )
     {
      var keyType = $(this).data( 'input' );
      if( keyType === true )
        keyType = 'input';
      else
        keyType = 'text';

        keyFuncMap[ columnIndex ] = keyFuncs[ keyType ];
     }
     else
     {
        keyFuncMap[ columnIndex ] = keyFuncs['void']; 
     }
    }); // each th


    var $rows = $table.find( 'tbody tr,tfoot tr' );    
    $rows.addClass('visible');   //default each row to visible
    
    $( filter_id ).keyup( function(event) {  
    //if esc is pressed or nothing is entered  
    if( event.keyCode == 27 || $(this).val() == '' ) {  
      //if esc is pressed we want to clear the value of search box  
      $(this).val('');  
      //we want each row to be visible because if nothing  
      //is entered then all rows are matched.  
      $rows.removeClass('visible').show().addClass('visible');  
    }  
    //if there is text, lets filter  
    else {
      table_filter_worker( $rows, $(this).val(), keyFuncMap );  
    }    
    });
  }


  var table_sorter_new = function( table_id, opts ) {
    
    // use module pattern (see JavaScript - The Good Parts)

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

      
    var groupClass,
        hasGroupClass;        
    
    var $table,
        $tbody,
        $rows;  

  function _debug( msg )
  {
    // console.log( "[debug] " + msg ); 
  }
    
  function _sort_col( $col, colIndex )
  {
     _debug( "call _sort_col("+colIndex+")" );
     
      var keyType = $col.data( 'input' );
      if( keyType === true )
         keyType = 'input';
      else
         keyType = 'text';

      var sortType = $col.data( 'type' );
      if( sortType === undefined )
         sortType = 'string';
    
      _debug( "keytype: " + keyType + ", sortType: " + sortType ); 
    
      var keyFunc  = keyFuncs[ keyType ];
      var convFunc = convFuncs[ sortType ];
      var sortFunc = sortFuncs[ sortType ];      

      
      /////////////////////////////
      // sort code starts here
      
      var sortDirection = $col.is( '.sorted-asc' ) ? -1 : 1;
      
      _debug( "sortDirection: " + sortDirection );
  
  
      $rows.each( function( index, row ) {
            row.sortKey = convFunc( keyFunc( $(row).children( 'td' ).eq( colIndex ) ));
            row.sortPos = index;   // NB: stable sort hack, part i - on equal use sortPos to keep stable sort with unstable sort

            // _debug( "["+index+"] => " + row.sortKey );
            
            // before add subrows
            if( hasGroupClass ) {
              // console.log( "before subrows" );
              row.$subrows = $(row).nextUntil( 'tr.'+groupClass );
              // console.log( "after subrows " + row.$subrows.length );
            }            
      }); // each rows
         
      $rows.sort( function( left, right ) {
          var result = sortFunc( left.sortKey, right.sortKey );

          if( sortDirection == -1 )
            result = -result;
          
          // NB: stable sort hack, part ii
          if( result == 0 )
            result = left.sortPos - right.sortPos;
            
          return result;
      }); // sort
        
      $rows.each( function( index, row ) {
        $tbody.append( row );
          // row.sortKey = null;
          // row.sortPos = null;

        // add possible subrows
        if( hasGroupClass )
          $tbody.append( row.$subrows );

       });
        
       $table.find( 'thead tr:last th').removeClass( 'sorted-asc sorted-desc' );
       (sortDirection == 1) ? $col.addClass( 'sorted-asc' ) : $col.addClass( 'sorted-desc' );
        
  } // function _sort_col
  
  function _init( table_id, opts )
  {
    if( $.type( opts ) === 'undefined' )
      opts = {};
        
    groupClass = opts.groupClass;    
    hasGroupClass =  $.type( groupClass ) === 'string';
    
    $table = $( table_id );
    $tbody = $table.find( 'tbody' );
 
    if( hasGroupClass  )
      $rows = $tbody.find( 'tr.'+groupClass );
    else
      $rows = $tbody.find( 'tr' );
           
    // console.log( $rows );
 
    
    // NB: by default use :last (if more than one table header row; only use the last one)
    $table.find( 'thead tr:last th' ).each( function( colIndex ) {

       // NB: lets you use data-sort=false to make column NOT sortable
       var $col = $(this);       
       var sortable = $col.data( 'sort' );
       if( sortable === undefined )
         sortable = true;
    
       if( sortable )
       {
          // console.log( "sortable["+columnIndex+"]" );      
          // NB: add class .sortable for easy styling
          $col.addClass( 'sortable' );     
          $col.click( function() {
             _sort_col( $col, colIndex );
          }); 
       }
    });  // each th
  } // function _init

  
  _init( table_id, opts );  

  
    return {
      sort: function( colIndex ) {

         _debug( "call sort("+ colIndex +")" );        
        
         var $col = $table.find( 'thead tr:last th' ).eq( colIndex );
         
         // NB: lets you use data-sort=false to make column NOT sortable
         var sortable = $col.data( 'sort' );
         if( sortable === undefined )
           sortable = true;
    
         if( sortable )
           _sort_col( $col, colIndex );
           
           return this;
      },
      zebra: function() {
        return this;
      },
      another_method: function() {
        return this;
      }
    };  
  };

  function table_sorter( table_id, opts )
  {
    var sorter = table_sorter_new( table_id, opts );
    // sorter.sort( 2 );
    return sorter;
  }

  
  function table_hovered( table_id )
  {
    $( table_id ).find( 'tbody tr,tfoot tr' ).hover( function() {  
       $(this).find( 'td' ).addClass( 'hovered' );  
     }, function() {  
       $(this).find( 'td' ).removeClass( 'hovered' );  
    });
  }

  
  function table_expander( table_sel, group_class )
  {
    var up_class   = 'expander-hide';
    var down_class = 'expander-show';

    $( table_sel ).each( function() {
                        
      var $table  = $( this );    
      var $groups = $table.find( "tr."+group_class );    

      // NB: by default rows started out shown/expanded    
      $groups.addClass( up_class );    

      // NB: add last style class to last td for easy styling with icons
      //  ie8 doesn't support :last-child in css
      $groups.find( "td:last" ).addClass( 'last' );    
      $groups.find( "td:first" ).addClass( 'first' );    
    
      $groups.click( function() {
        $(this).nextUntil("tr."+group_class ).toggle();
        $(this).toggleClass( up_class + " " + down_class );  // adds first; removes second class
      });    
    }); // each table
  }   
