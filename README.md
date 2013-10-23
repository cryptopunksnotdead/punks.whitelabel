## What is `jquery.table.js`?

Lets you sort, filter tables using JavaScript w/ jQuery

## Demos

* Demo 1 -> [demo/demo1.html](http://libsjs.github.io/jquery.table.js/demo/demo1.html)
* Demo 2 -> [demo/demo2.html](http://libsjs.github.io/jquery.table.js/demo/demo2.html)
* Demo 3 -> [demo/demo3.html](http://libsjs.github.io/jquery.table.js/demo/demo3.html)
* Demo 4 -> [demo/demo4.html](http://libsjs.github.io/jquery.table.js/demo/demo4.html)
* Demo 5 -> [demo/demo5.html](http://libsjs.github.io/jquery.table.js/demo/demo5.html)
* Demo Plugin -> [demo/demo.plugin.html](http://libsjs.github.io/jquery.table.js/demo/demo.plugin.html)


## How to use

Include the `jquery.table.js` script after the jquery library. Example:

    <script src='jquery.min.js'></script>
    <script src='jquery.table.js'></script>
    
That's it.

## Notes


### Sortable

Using `data-sort='false'` lets you mark header columns as not sortable. Example:

    <th data-sort='false'>do not sort</th>

Note: All sortable header columns get marked with the `.sortable` style class.
If a column got sorted ascending it gets marked with the `.sort-asc` style class
and if descending it gets marked with `.sort-desc` to let you add styles. Example:

    th.sortable {
      cursor: pointer;
      padding-right: 23px;
      background-repeat: no-repeat;
      background-position: right center;
      background-image: url('i/bg.gif');
    }
    
    th.sortable.sorted-asc,
    th.sortable.sorted-desc  {
      color: white;
      background-color: grey;
    }
    
    th.sortable.sorted-asc {
      background-image: url('i/asc.gif');
    }
    
    th.sortable.sorted-desc {
      background-image: url('i/desc.gif');
    }
    
    th.sortable:hover {
      color: black;
      background-color: yellow; 
      text-decoration: underline;
    }


### Filterable

Using `data-filter='false'` lets you mark columns as not filterable. Example:

    <th data-filter='false'>do not filter</th>

Note: Table rows in `tfoot` will not get filtered. (Lets you add an empty new table row, for example.)

### Data Types (Cell Text to Data Type)

Using `data-type` lets you specify the data type for sorting. Possible values include `string|int|float`.
Example:

    <th data-type='int'>number (int)</th>
    <th data-type='float'>number (float)</th>

### Cell Types (Cell to Cell Text)

Using `data-input='true'` lets you use the value from an input text control
(default is using the text from the cell). Example:

    <th data-input='true'>string</th>


## Example - All toghether now

### Read-Only

    <table>
       <thead>
         <tr>
            <th data-type='int'>number (int)</th>
            <th data-type='float'>number (float)</th>
            <th>string</th>
            <th>date</th>
            <th data-sort='false'>do not sort</th>
         </tr>
       </thead>
       <tbody>
         <tr><td>2</td><td>-.18</td><td>apple</td><td>Mar 15, 1986</td></tr>
         <tr><td>15</td><td>88.5</td><td>banana</td><td>Aug 07, 2004</td></tr>
         <tr><td>-53</td><td>-858</td><td>orange</td><td>Feb 27, 2086</td></tr>
       </tbody>
    </table>


### Editable

    <table>
       <thead>
         <tr>
            <th data-input='true' data-type='int'>number (int)</th>
            <th data-input='true' data-type='float'>number (float)</th>
            <th data-input='true'>string</th>
            <th data-input='true'>date</th>
            <th data-sort='false'>do not sort</th>
         </tr>
       </thead>
       <tbody>
         <tr>
          <td><input type='text' value='2'></td>
          <td><input type='text' value='-.18'></td>
          <td><input type='text' value='apple'></td>
          <td><input type='text' value='Mar 15, 1986'></td>
         </tr>
         <tr>
          <td><input type='text' value='15'></td>
          <td><input type='text' value='88.5'></td>
          <td><input type='text' value='banana'></td>
          <td><input type='text' value='Aug 07, 2004'></td>
         </tr>
         <tr>
          <td><input type='text' value='-53'></td>
          <td><input type='text' value='-858'></td>
          <td><input type='text' value='orange'></td>
          <td><input type='text' value='Feb 27, 2086'></td>
         </tr>
       </tbody>
       <tfoot>
         <tr><td><input type='text'></td>
             <td><input type='text'></td>
             <td><input type='text'></td>
             <td><input type='text'></td>
         </tr>
       </tfoot>
    </table>

## Ruby on Rails Integration - `jquery-table-js-rails` Ruby Gem

Gabor Garami has bundled up the jquery.table.js script into a Ruby gem for easy integration for Rails apps. See:

- [`jquery-table-js-rails` GitHub Project](https://github.com/hron84/jquery-table-js-rails)
- [`jquery-table-js-rails` Ruby Gem Page](https://rubygems.org/gems/jquery-table-js-rails)


## License

The scripts are dedicated to the public domain. Use it as you please with no restrictions whatsoever.
