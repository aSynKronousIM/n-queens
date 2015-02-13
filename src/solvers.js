/*
           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solution = new Board({n: n}); //create blank solution board of size n

  var recursion = function(rooksToPlace, solutionBoard) {
    var allRows = solutionBoard.rows();                 //create a matrix (array of arrays) to represent the board 
    if (rooksToPlace === 0) {                           // if there are no rooks left to place
      return solutionBoard;                               // then all rooks have been placed, so return the solution board 
    } else {                                            // if there are one or more rooks left to place
      for (var i = 0; i < allRows.length; i++) {   
        for (var j = 0; j < allRows.length; j++) {          // together, these two loops iterate over each space on the board
          if(allRows[i][j]==0){                               // if a space does not have a rook on it
            solutionBoard.togglePiece(i, j);                    // then place a rook on that space
            if (solutionBoard.hasAnyRooksConflicts()) {         // if that placement causes a conflict
              solutionBoard.togglePiece(i, j);                    // remove that rook from that space
            } else {                                            // if there is no conflict
              break;                                              // break from the inner loop, i.e. move on to the next row
            }
          } else {                                            // if a space has a rook, 
            break;                                            // do nothing and move on the next row
          }
        }
      }
      if (!solutionBoard.hasAnyRooksConflicts()) {      // after iterating over the board, if there are no conflicts
        return recursion(rooksToPlace - 1, solutionBoard); // run recursion on the new solutionBoard, with one less rook to place
      } 
    }
  }           
  solution = recursion(n, solution); // run recursion on the empty nxn solution board, with n rooks to place


  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows(); // return the matrix representation of the solution board
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0; 

  var recursion = function(n){
    if(n === 0){
      return 0;
    }
    if(n === 1){
      return 1;
    } else {
      var sum = 0;
      for(var i = 0;i<n;i++){
        sum += recursion(n-1);
      }
      return sum;
    }
  }

  // recursion(3);
  //   n===1 // false
  //     sum = 0
  //     for(var i = 0;i<3;i++){
  //       sum += recursion(2);
  //              recursion(2)
  //                n===1 // false
  //                 sum = 0
  //                 for(var i = 0;i<2;i++){
  //                     sum += recursion(1);
  //                             recursion(1)
  //                                n===1 // true
  //                                 return 1
  //                     sum += 1; // sum === 1, i === 0
  //                 }
  //                 for(var i = 0;i<2;i++){ 
  //                     sum += recursion(1);
  //                             recursion(1)
  //                                n===1 // true
  //                                 return 1
  //                     sum += 1; // sum === 2, i === 1
  //                 }
  //                 ///sum === 2
  //               /// === 2

  solutionCount = recursion(n);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

/*
[1][0][0] [1][0][0] [0][0][1] [0][0][1] [0][1][0] [1][0][0] [0][1][0] [0][0][1]
[0][1][0] [0][0][1] [1][0][0] [0][1][0] [1][0][0] [0][1][0] [0][0][1] [0][1][0]
[0][0][1] [0][1][0] [0][1][0] [1][0][0] [0][0][1] [0][0][1] [1][0][0] [1][0][0]

[1][0][0] [1][0][0] [0][0][1] [0][0][1] [0][1][0] [0][1][0] 
[0][1][0] [0][0][1] [1][0][0] [0][1][0] [1][0][0] [0][0][1]
[0][0][1] [0][1][0] [0][1][0] [1][0][0] [0][0][1] [1][0][0]

[0][0]
[0][0]  

[0][1][0][0]
[0][0][1][0]
[1][0][0][0]
[0][0][0][1]

[0][1][0][0][0]
[0][0][1][0][0]
[1][0][0][0][0]
[0][0][0][1][0]
[0][0][0][0][1]

*/

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n});
  var solution = board.rows();
  
  var step = function(row) {
    // if no more rows
    if (row === n) {
      solution = _.map(board.rows(), function(row) {
        return row.slice();
      });
      // return result
      return;
    }

    // iterate through each row
    for (var i = 0; i < n; i++) { 
      // place a piece
      board.togglePiece(row, i);
      // check to see if any conflicts
      if (!board.hasAnyQueensConflicts()) {
        // recurse on next row
        step(row + 1);
      } 
      // remove a piece
      board.togglePiece(row, i);
    }
  };
  step(0);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

//return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;

  var matrixDeepCopy = function(matrix){
    var newMatrix = [];
    for(var i = 0;i<matrix.length;i++){
      var newRow = [];
      for(var j = 0;j<matrix[i].length;j++){
        newRow[j] = matrix[i][j];
      }
      newMatrix[i] = newRow;
    }
    return newMatrix;
  } 
  
  var recursion = function(rowsRemaining,solutionsSoFar){
// base case: rowsRemaining == 0; return solutionsSoFar
// else:
  // for each of the solutions so far
    // iterate across the current row, and test adding a queen to each space
      // if adding the queen does not produce errors, push this to currentSolutions
    // return current solutions
    var str;
    var str2; 
    // if(solutionsSoFar){
    //   debugger;
    //   str = JSON.stringify(solutionsSoFar[0].rows());
    //   debugger;
    // }
    var solutionsSoFar = solutionsSoFar || [new Board({n: n})];
    
    if(rowsRemaining === 0){
      return solutionsSoFar;
    } else {
      var currentSolutions = [];
      for (var i = 0; i < solutionsSoFar.length; i++) {
        var pSolutions = new Board(solutionsSoFar[i].rows());
        for (var j = 0; j < n; j++) {
          
          pSolutions.togglePiece(n-rowsRemaining, j);
          str2 = JSON.stringify(pSolutions.rows());
          if (!pSolutions.hasAnyQueensConflicts()) {
            
            var psCopy = matrixDeepCopy(pSolutions.rows());
            str = JSON.stringify(psCopy);
            debugger;
            currentSolutions.push(new Board(psCopy));
          }
          // str = JSON.stringify(currentSolutions[0].rows());
          // debugger;
          pSolutions.togglePiece(n-rowsRemaining, j);
          // str2 = JSON.stringify(currentSolutions[0].rows());
          // debugger;
        }
      }
      if(currentSolutions[0]){
        str2 = JSON.stringify(currentSolutions[0].rows());
        debugger;
      }
      return recursion(rowsRemaining - 1, currentSolutions);
    }
  };
  solutionCount = recursion(n).length;
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};


// // return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
// window.countNQueensSolutions = function(n) {
//   var solutionCount = undefined; //fixme

//   var solutionsByTestingAllCases = function(n){ // Tests all by brute force, returns array for n. To be used for base case.
//     var solutions = [];

//     return solutions;
//   };

//   var create4nm4SingleQueenBoards = function(numberOfBoards){ // Creates an array of 4n-4 boards, each with one queen, pleaced on each of the outer spaces.
//     var singleQueenBoards = [];

//     return singleQueenBoards;
//   };

//   var addNm1SolutionToSingleQueenBoard = function(Nm1Solution,singleQueenBoard){ //Updates singleQueenBoard so that the queens from an n-1 solution are in appropriate places  


//     return singleQueenBoard;
//   }

//   var recursion = function(n,solutions){
// // function recursion(n,solutions)
// // if n is 0, 1, 2, or 3, return given values
// // 4 is base case: test all possible cases, and return solutions
// // 5 and greater, for each of recursion(n-1) solutions, 
//   //create 4n-4 nxn boards that each have one queen, queens placed on successive outer spaces
//   //for each of the boards with the singly placed queen just created
//     // add the current n-1 solution to the single queen board such the solution fills the rows and columns not occupied by the queen
//     // The single queen board will now have n queens, if there are no queen conflicts, add this to current solutions
//   // return the current solutions

//     var solutions;

//     if(){

//     } else {


//       return solutions
//     }
//   }

//   console.log('Number of solutions for ' + n + ' queens:', solutionCount);
//   return solutionCount;
// };
