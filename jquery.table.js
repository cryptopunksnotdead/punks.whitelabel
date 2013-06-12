
  var table_sorter_new = function( table_id, opts ) {
    
    // use module pattern (see JavaScript - The Good Parts)

    function _debug( msg )
    {
       // console.log( "[debug] " + msg ); 
    }
    
    var keyFuncs = {
          "input" : function( $cell ) { return $cell.find('input[type=text]').val(); },
          "text":   function( $cell ) { return $cell.text(); }
        };
    
    var sortFuncs = {
          "int"    : function(left,right) { return left - right; },
          "float"  : function(left,right) { return left - right; },
          "string" : function(left,right) { if (left<right) return -1; if (left>right) return 1; return 0;},
          "date"   : function(left,right) { return left - right; }
        };    

    // NB: use replace( /,/g, '' ) for numbers (remove , lets you use 123,444,444 instead of 123444444 )
    // convert from text to data type
    var convFuncs = {
          "int"    : function(text) {
            var i = parseInt( text.replace( /,/g, ''), 10 );
            return (isNaN(i)) ? 0 : i;
            },
          "float"  : function(text) {
            var f = parseFloat( text.replace( /,/g, '') );
            return (isNaN(f)) ? 0 : f;
            },
          "string" : function(text) {
            // convert to lower case (thus, ignore case in sort)
            return text.toLowerCase();
            },
          "date"   : function(text) {
            _debug( "convDate before >" + text +"<" );
            text = text.replace( /\-/g, '/' );
            
            // NB: 0 == 1970/1/1, thus, lets use 1800/1/1 for now
            var f = parseFloat( new Date( '1800/01/01' ).getTime() ); 

            // current date format DD{1,2}/MM{1,2}/YYYY supported:
            // e.g.   12.02.1999 or 12/2/1999 or 1-12-2011
            var re = /(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{4})/;
            var match = re.exec( text );            
            if( match ) {
              text = match[3]+"/"+match[2]+"/"+match[1];              
              _debug( "convDate match >" + text + "<" );
 
              // year  = parseInt( match[3], 10 );
              // month = parseInt( match[2], 10 )-1;  // NB:  beginning with 0 for January to 11 for December.
              // day   = parseInt( match[1], 10 );
              //
              // text = year+"-"+month+"-"+day;
              // _debug( "convDate date ints>" + text + "<" );
              
              // todo: check what happens if date is invalid?? do we get an exception? invalid object?
              var f = parseFloat( new Date( text ).getTime() );
              if(isNaN(f))
                 f = 0;
            }
            _debug( "convDate after >" + f +"<" );
            return f;            
        }
      };    

    // todo/fix:
    // make it into a struct  colDef or similar
    var keyFuncMap  = [];  // keyFuncMap for/from columns
    var convFuncMap = [];
    var sortFuncMap = [];
    var filterableMap = [];
    var sortableMap   = [];
      
    var groupClass,
        hasGroupClass;        
    
    var $table,
        $tbody,
        $rows,
        $filterRows;  // filter rows = rows + (tfoot tr, that is, rows in footer)


  function _filter_worker( query ) {  
    query =   $.trim(query); //trim white space  
    query = query.replace(/ /gi, '|'); //add OR for regex query  

    var regex = new RegExp(query, 'i');
    
    $filterRows.each( function( rowIndex, row ) {      
      var text = "| ";
      var $row = $(row);
      $row.find( 'td' ).each( function( colIndex, col ) {
        var filterable = filterableMap[colIndex];
        if( filterable )
          text += keyFuncMap[colIndex]( $(col) ) + " |";
        else
          text += " |"; 
      });      
      
      // console.log( "[debug] text: " + text );
      
      if( text.search( regex ) < 0 ) {  
          $row.hide().removeClass('visible')  
      } else {  
          $row.show().addClass('visible');  
      }
    });  // each row
  }    

  function _filter( filter_id )
  {    
    
    $filterRows = $table.find( 'tbody tr,tfoot tr' );    
    $filterRows.addClass('visible');   //default each row to visible
    
    $( filter_id ).keyup( function(event) {  
    //if esc is pressed or nothing is entered  
    if( event.keyCode == 27 || $(this).val() == '' ) {  
      //if esc is pressed we want to clear the value of search box  
      $(this).val('');  
      //we want each row to be visible because if nothing  
      //is entered then all rows are matched.  
      $filterRows.removeClass('visible').show().addClass('visible');  
    }  
    //if there is text, lets filter  
    else {
      _filter_worker( $(this).val() );  
    }    
    });
  }
 
  function _hover()
  {
    $table.find( 'tbody tr,tfoot tr' ).hover( function() {  
       $(this).find( 'td' ).addClass( 'hovered' );  
     }, function() {  
       $(this).find( 'td' ).removeClass( 'hovered' );  
    });
  }

        
  function _zebra()
  {
    var evenClass       = 'even';
    var oddClass        = 'odd';
    var otherClass      = 'child';  // used for subrows for groups (if groups used)
    var evenOtherClass  = evenClass + '-' + otherClass;  // e.g. even-other
    var oddOtherClass   = oddClass + '-' + otherClass;   // e.g. odd-other

    $rows.each( function( index, row ) {
      // NB: index is zero-based e.g. begins with 0
      var $row = $(row);      
      $row.removeClass( evenClass + ' ' + oddClass );
      var isEven = index % 2 === 1;   // eg.  0|2|4 % 2 == 0,  1|3|5 % 2 == 1  || 0+1 = 1, 2+1 = 3, etc.
      if( isEven )   
        $row.addClass( evenClass );
      else      
        $row.addClass( oddClass );  
        
      // check possible subrows
      if( hasGroupClass ) {
        var $subrows = $row.nextUntil( 'tr.'+groupClass );        
        $subrows.each( function( subindex, subrow ) {
           var $subrow = $(subrow);
           $subrow.removeClass( evenOtherClass +' ' + oddOtherClass );
           if( isEven ) 
             $subrow.addClass( evenOtherClass );           
           else      
             $subrow.addClass( oddOtherClass ); 
        });
      }
    });
  }
    
  function _sort_col( $col, colIndex )
  {
     _debug( "call _sort_col("+colIndex+")" );
    
      var keyFunc  = keyFuncMap[ colIndex ];
      var convFunc = convFuncMap[ colIndex ];
      var sortFunc = sortFuncMap[ colIndex ];      
      
      /////////////////////////////
      // sort code starts here
      
      var sortDirection = $col.is( '.sorted-asc' ) ? -1 : 1;
      
      _debug( "sortDirection: " + sortDirection );
  
  
      $rows.each( function( rowIndex, row ) {
            row.sortKey = convFunc( keyFunc( $(row).children( 'td' ).eq( colIndex ) ));
            row.sortPos = rowIndex;   // NB: stable sort hack, part i - on equal use sortPos to keep stable sort with unstable sort

            // _debug( "["+rowIndex+"] => " + row.sortKey );
            
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
        
      $rows.each( function( rowIndex, row ) {
        $tbody.append( row );
          // row.sortKey = null;
          // row.sortPos = null;

        // add possible subrows
        if( hasGroupClass )
          $tbody.append( row.$subrows );

       });
        
       $table.find( 'thead tr:last th').removeClass( 'sorted-asc sorted-desc' );
       if( sortDirection == 1 )
         $col.addClass( 'sorted-asc' );
       else
         $col.addClass( 'sorted-desc' );
       
       _zebra();
        
  } // function _sort_col
  
  function _init( table_id, opts )
  {
    if( $.type( opts ) === 'undefined' )
      opts = {};
        
    groupClass = opts.groupClass;    
    hasGroupClass =  $.type( groupClass ) === 'string';
    
    // nb: will find w/ selector or wrap vanilla javascript this in jquery wrapped $(this)
    $table = $( table_id );
    
    $tbody = $table.find( 'tbody' );
 
    if( hasGroupClass  )
      $rows = $tbody.find( 'tr.'+groupClass );
    else
      $rows = $tbody.find( 'tr' );
           
    // console.log( $rows );
 
    
    // NB: by default use :last (if more than one table header row; only use the last one)
    $table.find( 'thead tr:last th' ).each( function( colIndex, col ) {

       // NB: lets you use data-sort=false to make column NOT sortable
       var $col = $(col);       
       var sortable = $col.data( 'sort' );
       if( sortable === undefined )
         sortable = true;

       // NB: lets you use data-filter=false to make column NOT filterable
       var filterable = $col.data( 'filter' );
       if( filterable === undefined )
         filterable = true;

       filterableMap[colIndex] = filterable;
       sortableMap[colIndex]   = sortable;

       var keyType = $col.data( 'input' );
       if( keyType === true )
         keyType = 'input';
       else
         keyType = 'text';

       keyFuncMap[ colIndex ] = keyFuncs[ keyType ];

       if( sortable )
       {
         var sortType = $col.data( 'type' );
         if( sortType === undefined )
           sortType = 'string';
           
         convFuncMap[ colIndex ] = convFuncs[ sortType ];
         sortFuncMap[ colIndex ] = sortFuncs[ sortType ]; 

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
        _zebra();                
        return this;
      },
      hover: function() {
        _hover();
        return this;
      },
      filter: function( filter_id ) {
        _filter( filter_id );
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


////////////////////
// wrapper for jquery plugin


(function( $ ) {

    function debug( msg ) {
      if( window.console && window.console.log ) {
        window.console.log( "[debug] "+msg );
      }
    }

    function setup_table_sorter( table_el, opts ) {
      debug( "hello from setup_table_sorter" );
      var table_sorter = table_sorter_new( table_el, opts );
      var $table = $(table_el);
      
      // NB: attach table sorter to dom table element
      // - use like $('#table1').data( 'table_sorter' ).hover().sort(1); etc.
      //  or
      //   var t = $('#table1').data( 'table_sorter' );
      //    t.hover().sort(1);
      $table.data( 'table_sorter', table_sorter );  
      return table_el;
    }

    debug( 'add jquery fn table_sorter' );

    $.fn.table_sorter = function( opts ) {
        debug( "calling table_sorter" );
        return this.each( function( index, table_el ) {
          debug( "before setup_table_sorter["+ index +"]" );
          setup_table_sorter( table_el, opts );
          debug( "after setup_table_sorter["+ index +"]" );
        });
    };

}( jQuery ));
