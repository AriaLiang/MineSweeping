let timer = null; // The timer

// basic settings of my game
let myGame = function(ele, row, col, mines) {
  this.canvasEle = ele; // canvas element
  this.canvasContext = this.canvasEle.getContext("2d");
  this.gridSize = 20; // grid size
  this.rowNum = row; // number of rows
  this.colNum = col; // number of columns
  this.mineNum = mines; // number of mine
  this.mineMatrix = [];
  this.isFirst = 1;
};

myGame.prototype = {
  // init
  initGame: function () {
    this.canvasEle.width = this.gridSize * this.colNum;
    this.canvasEle.height = this.gridSize * this.rowNum;

    // Generate a random array with a length of the total number of grids
    let count = this.rowNum * this.colNum;
    let arr = [];
    for (let i = 0; i < count; i++) {
      arr[i] = i + 1;
    }
    arr.sort(function() {
      return 0.5 - Math.random()
    });

    // Set initial attributes of each grid
    for (let i = 0; i < this.rowNum; i++) {
      this.mineMatrix[i] = [];
      for (let j = 0; j < this.colNum; j++) {
        this.mineMatrix[i][j] = {
          state: 'unopened', // The initial state of each grid is not opened
          bomb: (arr[i * this.colNum + j + 1] <= this.mineNum) ? 1 : 0, // Random bomb
        };
        this.drawGrid(i, j, "unopened");
      }
    }
  },
  canvasEvents: function () {
    this.canvasEle.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      let x, y;
      if (e.layerX || e.layerX === 0) {
        x = e.layerX;
        y = e.layerY;
      } else if (e.offsetX || e.offsetX === 0) { // Opera compatible
        x = e.offsetX;
        y = e.offsetY;
      }
      const arrPos = this.getArrPos(x, y); // Get the position i and j
      const i = arrPos.i;
      const j = arrPos.j;
      if (this.mineMatrix[i][j].state === "unopened" || this.mineMatrix[i][j].state ==="markFlag" || this.mineMatrix[i][j].state === "markQuestion") {
        if (this.mineMatrix[i][j].state === "unopened") {
          this.drawGrid(i, j, "markFlag");
          document.getElementById("myMines").innerHTML = (-- this.mineNum).toString();
        } else if (this.mineMatrix[i][j].state === "markFlag") {
          this.drawGrid(i, j, "markQuestion");
          document.getElementById("myMines").innerHTML = (++ this.mineNum).toString();
        } else if (this.mineMatrix[i][j].state === "markQuestion") {
          this.drawGrid(i, j, "unopened");
        }
      }
    }.bind(this));

    this.canvasEle.addEventListener('click', function(e) {
      if (this.isFirst === 1) { // If is the first click
        this.isFirst = 0;
        this.startTimer(); // Start the timer
      }
      let x, y;
      if (e.layerX || e.layerX === 0) {
        x = e.layerX;
        y = e.layerY;
      } else if (e.offsetX || e.offsetX === 0) { // Opera compatible
        x = e.offsetX;
        y = e.offsetY;
      }
      const arrPos = this.getArrPos(x, y); // Get the position i and j
      const i = arrPos.i;
      const j = arrPos.j;
      if (this.mineMatrix[i][j].state === "unopened") {
        if (this.mineMatrix[i][j].bomb === 1) {
          this.stopTimer(); // Stop the Timer
          alert("踩雷啦！请重新刷新开始。");
          for (let a = 0; a < this.rowNum; a++) {
            for (let b = 0; b < this.colNum; b++) {
              if (this.mineMatrix[a][b].bomb === 1) {
                this.drawGrid(a, b, "isBomb");
              }
            }
          }
        } else {
          // Determine whether there are mines in 8 locations around
          this.ifNearbyBomb(i, j);
        }
      } else {

      }
    }.bind(this));
  },
  getArrPos: function(x, y) {
    let i, j;
    i = Math.floor(y / this.gridSize);
    j = Math.floor(x / this.gridSize);
    return {
      i: i,
      j: j
    };
  },
  ifNearbyBomb: function (i, j) {
    if (this.mineMatrix[i][j].state !== "noBomb") {
      let nearbyMines = 0;
      for (let a = i - 1; a <= i + 1; a++) {
        for (let b = j - 1; b <= j + 1; b++) {
          // Do not cross the boundary
          if (a >= 0 && a < this.rowNum && b >= 0 && b < this.colNum && !(a === i && b === j)) {
            if (this.mineMatrix[a][b].bomb === 1) {
              nearbyMines ++;
            }
          }
        }
      }
      // After traversing, no mine was found
      if (nearbyMines === 0) {
        this.drawGrid(i, j, "noBomb");
        for (let a = i - 1; a <= i + 1; a++) {
          for (let b = j - 1; b <= j + 1; b++) {
            if (a >= 0 && a < this.rowNum && b >= 0 && b < this.colNum && !(a === i && b === j)) {
              this.ifNearbyBomb(a, b);
            }
          }
        }
      } else {
        this.drawGrid(i, j, nearbyMines);
      }
    }
  },
  drawGrid: function (i, j, state) {
    let stateTypes = {
      unopened: '#F1DCDB',
      noBomb: '#FEC6B9',
      isBomb: '#797FA1',
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      markFlag: '#DD8998',
      markQuestion: '#708EC4',
    }; // Set their own styles for each grid
    if (typeof stateTypes[state] === "string") {
      with (this.canvasContext) {
        fillStyle = stateTypes[state];
        fillRect(j * this.gridSize, i * this.gridSize, this.gridSize, this.gridSize);
        lineWidth = 0.5;
        strokeStyle = 'white';
        strokeRect(j * this.gridSize, i * this.gridSize, this.gridSize, this.gridSize);
      }
    } else if (typeof stateTypes[state] === "number") {
      with (this.canvasContext) {
        fillStyle = '#FEC6B9';
        fillRect(j * this.gridSize, i * this.gridSize, this.gridSize, this.gridSize);
        lineWidth = 0.5;
        strokeStyle = 'white';
        strokeRect(j * this.gridSize, i * this.gridSize, this.gridSize, this.gridSize);
        font = '32px';
        fillStyle = 'black';
        fillText(stateTypes[state], j * this.gridSize + 6, (i + 1) * this.gridSize - 6);
      }
    }
    this.mineMatrix[i][j].state = state; // Set state for the grid
  },
  startTimer: function() {
    let count = 0;
    let str = "";
    timer = setInterval(function() {
      count ++;
      if (count < 10) { str = "00" + count.toString(); }
      else if (count < 100) { str = "0" + count.toString(); }
      else { str = count.toString(); }
      document.getElementById("myClock").innerHTML = str;
    }, 1000)
  },
  stopTimer: function() {
    timer = clearInterval(timer);
  }
}

window.onload = function() {
  let game = new myGame(this.document.getElementById("myGame"), 16, 30, 99);
  game.initGame();
  game.canvasEvents();
};
