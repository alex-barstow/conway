'use strict';

/*
 * Conway Game of Life
 * - Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
 * - Any live cell with two or three live neighbours lives on to the next generation.
 * - Any live cell with more than three live neighbours dies, as if by overpopulation.
 * - Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */
class ConwayGame {
  constructor() {
    this.boardArray = [];
    this.checkAndSetCells = this.checkAndSetCells.bind(this);
  }

  // creates an empty "square" board with the provided dimension
  buildEmptyBoard(dimension) {
    for (let i = 0; i < dimension; i++) {
      this.boardArray.push(new Array(dimension).fill(0));
    }
  }

  // draws this.boardArray on the page as an HTML5 table
  drawHTML() {
    const gameDiv = document.getElementById('game-div');
    const htmlTable = document.createElement('table');

    for (let i = 0; i < this.boardArray.length; i++) {
      const tableRowNode = document.createElement("tr");
      htmlTable.appendChild(tableRowNode);

      for (let j = 0; j < this.boardArray.length; j++) {
        const tableDataNode = document.createElement("td");
        tableRowNode.appendChild(tableDataNode);
        if (this.boardArray[i][j] === 1) {
          tableDataNode.style.backgroundColor = 'black';
        }
      }
    }
    gameDiv.innerHTML = '';
    gameDiv.appendChild(htmlTable);
  }

  // loops through the board cells and randomly assigns the
  // provided number of cells to be alive or dead.
  // it's slow, but satisfactory at a small scale
  setInitialState(aliveNumber) {
    if (aliveNumber <= this.boardArray.length * this.boardArray.length) {
      for (let i = 0; i < aliveNumber; i++) {
        let rowNumber = Math.floor(Math.random() * this.boardArray.length);
        let columnNumber = Math.floor(Math.random() * this.boardArray.length);

        if (this.boardArray[rowNumber][columnNumber] !== 1) {
          this.boardArray[rowNumber][columnNumber] = 1;
        } else {
          this.setInitialState(1);
        }
      }
    } else {
      console.log('Pick a valid number of cells');
    }
    this.drawHTML();
  }

  // creates a snapshot of the board state at the start of a generation.
  cloneBoardArray() {
    const clone = [];

    for (let i = 0; i < this.boardArray.length; i++) {
      clone.push(this.boardArray[i].slice(0))
    }
    return clone;
  }

  // calculates the sum of alive neighbors surrounding an individual cell
  getNeighborSum(x, y) {
    let neighborSum = 0;

    // For the three x positions around the given point
    for (let i = x - 1; i <= x + 1; i++) {

      // If the i position is legitimate (not undefined)
      if (this.boardArray[i]) {
        for (let j = y - 1; j <= y + 1; j++) {

          // This board index can still be out of bounds, but it won't throw in
          // this case. If the value is undefined, add zero to the sum instead
          // to avoid NaN issues.
          neighborSum += this.boardArray[i][j] || 0;
        }
      }
    }

    // subtracts the value of the current cell so it isn't counted toward the neighbor sum
    return neighborSum - this.boardArray[x][y];
  }

  // iterates through the board, calculates the number of alive cells around
  // each cell, and changes the alive/dead state of that cell accordingly.
  // represents a single "generation"
  checkAndSetCells() {
    const boardArrayClone = this.cloneBoardArray();

    for (let i = 0; i < this.boardArray.length; i++) {
      for (let j = 0; j < this.boardArray[i].length; j++) {
        const sum = this.getNeighborSum(i, j);

        if (this.boardArray[i][j] === 1) {
          if (sum < 2 || sum > 3) {
            boardArrayClone[i][j] = 0;
          }
        } else {
          if (sum === 3) {
            boardArrayClone[i][j] = 1;
          }
        }
      }
    }

    // use the updated boardArrayCLone to set the new state of the board and
    // render it on the page
    this.boardArray = boardArrayClone;
    this.drawHTML();
  }

  // creates a board and executes checkAndSetCells repeatedly
  runGame(boardDimension, aliveCellNum, timeInterval) {
    this.buildEmptyBoard(boardDimension);
    this.setInitialState(aliveCellNum);
    setInterval(this.checkAndSetCells, timeInterval);
  }
}

const conway = new ConwayGame;

conway.runGame(70, 900, 100);
