// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var sum = 0;
      for(var i = 0;i<row.length;i++){
        sum += row[i];
      }
      return sum>1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var allRows = this.rows();
      for(var i = 0;i<allRows.length;i++){
        if(this.hasRowConflictAt(i)){
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var allRows = this.rows();
      var sum = 0;
      for (var i = 0; i < allRows.length; i++) {
        sum += allRows[i][colIndex];
      }
      return sum > 1;
    },
    

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var allRows = this.rows();
      for(var i = 0;i<allRows.length;i++){
        if(this.hasColConflictAt(i)){
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var allRows = this.rows();
      var sum = 0;
      if(majorDiagonalColumnIndexAtFirstRow>0){
        for (var i = 0; i < allRows.length-majorDiagonalColumnIndexAtFirstRow; i++) {
          sum += allRows[i][majorDiagonalColumnIndexAtFirstRow+i];
        }
        return sum>1;
      } else {
        for (var i = 0; i < allRows.length; i++) {
          if(allRows[i][0]==1){
            for(var j = i;j<allRows.length;j++){
              sum += allRows[j][j-i];
            }
            return sum>1;
          }
        }
      }
      
    },

    /*
    [0][0][*][0][0]
    [0][0][0][*][0]
    [0][0][0][0][*]
    [0][0][0][0][0]
    [0][0][0][0][0]
    row: 0 , col: 2
    row: 1 , col: 3
    row: 2 , col: 4

    [0][0][0][0][0]
    [*][0][0][0][0]
    [0][*][0][0][0]
    [0][0][*][0][0]
    [0][0][0][*][0]
    row: 1 , col: 0
    row: 2 , col: 1
    row: 3 , col: 2
    row: 4 , col: 3

    [0][0][0][0][0]
    [0][0][0][0][0]
    [*][0][0][0][0]
    [0][*][0][0][0]
    [0][0][*][0][0]
    row: 2 , col: 0
    row: 3 , col: 1
    row: 4 , col: 2

    */

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var allRows = this.rows();
      for(var i = 0;i<allRows.length;i++){
        if(this.hasMajorDiagonalConflictAt(i)){
          return true;
        }
      }
      return false;
    },

    




    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var allRows = this.rows();
      var sum = 0;
      if(minorDiagonalColumnIndexAtFirstRow<allRows.length-1){
        for (var i = 0; minorDiagonalColumnIndexAtFirstRow - i >= 0; i++) {
          //debugger;
          sum += allRows[i][minorDiagonalColumnIndexAtFirstRow-i];
        }
        return sum>1;
      } else {
        for (var i = 0; i < allRows.length; i++) {
          //debugger;
          if(allRows[i][allRows.length - 1]===1){
            for(var j = i;j<allRows.length;j++){
              sum += allRows[j][allRows.length - j];
            }
            return sum>1;
          }
        }
      }

      return false; // fixme
    },

    /*
    [0][0][*][0][0]
    [0][*][0][0][0]
    [*][0][0][0][0]
    [0][0][0][0][0]
    [0][0][0][0][0]
    row: 0 , col: 2
    row: 1 , col: 1
    row: 2 , col: 0

    [0][0][0][0][0]
    [0][0][0][0][*]
    [0][0][0][*][0]
    [0][0][*][0][0]
    [0][*][0][0][0]
    row: 1 , col: 4
    row: 2 , col: 3 
    row: 3 , col: 2   
    row: 4 , col: 1


    */

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var allRows = this.rows();
      for(var i = 0;i<allRows.length;i++){
        if(this.hasMinorDiagonalConflictAt(i)){
          return true;
        }
      }
      
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
