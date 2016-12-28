// Conway Game of Life

//- Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
//- Any live cell with two or three live neighbours lives on to the next generation.
//- Any live cell with more than three live neighbours dies, as if by overpopulation.
//- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.


'use strict';

class ConwayGame {
  constructor() {
    this.boardArray = [];
    this.checkAndSetCells = this.checkAndSetCells.bind(this);
  }

  buildEmptyBoard(dimension) {
    for (let i = 0; i < dimension; i++) {
      this.boardArray.push(new Array(dimension).fill(0));
    }
  }

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

  cloneBoardArray() {
    let clone = this.boardArray.map((row) => {
      return row.slice();
    });
    return clone;
  }

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
    //-- so that the value of the current cell isnt counted toward the neighbor sum
    return neighborSum - this.boardArray[x][y];
  }

  checkAndSetCells() {
    let boardArrayClone = this.cloneBoardArray();

    for (let i = 0; i < this.boardArray.length; i++) {
      for (let j = 0; j < this.boardArray[i].length; j++) {
        let sum = this.getNeighborSum(i, j);

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
    this.boardArray = boardArrayClone;
    console.log(this.boardArray);
    this.drawHTML();
  }

  drawHTML() {
    let gameDiv = document.getElementById('game-board');
    let htmlTable = document.createElement('table');

    for (let i = 0; i < this.boardArray.length; i++) {
      let tableRowNode = document.createElement("tr");
      htmlTable.appendChild(tableRowNode);

      for (let j = 0; j < this.boardArray.length; j++) {
        let tableDataNode = document.createElement("td");
        tableRowNode.appendChild(tableDataNode);
        if (this.boardArray[i][j] === 1) {
          tableDataNode.style.backgroundColor = 'black';
        }
      }
    }
    gameDiv.innerHTML = '';
    gameDiv.appendChild(htmlTable);
  }

  runGame(boardDimension, aliveCellNum, timeInterval) {
    this.buildEmptyBoard(boardDimension);
    this.setInitialState(aliveCellNum);
    let go = setInterval(this.checkAndSetCells, timeInterval);
  }
}

const conway = new ConwayGame;

// conway.buildEmptyBoard(40);
// conway.setInitialState(0);
conway.runGame(50, 300, 100);
