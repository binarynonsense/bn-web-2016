// this is a quick port of the c# mines game in high entropy to js

const NUM_MINES_X = 16;
const NUM_MINES_Y = 16;

const TILE_STATE_UNCOVERED_0 = 0;
const TILE_STATE_UNCOVERED_1 = 1;
const TILE_STATE_UNCOVERED_2 = 2;
const TILE_STATE_UNCOVERED_3 = 3;
const TILE_STATE_UNCOVERED_4 = 4;
const TILE_STATE_UNCOVERED_5 = 5;
const TILE_STATE_UNCOVERED_6 = 6;
const TILE_STATE_UNCOVERED_7 = 7;
const TILE_STATE_UNCOVERED_8 = 8;
const TILE_STATE_MINE = 9;
const TILE_STATE_MINE_RED = 10;
const TILE_STATE_COVERED = 11;
const TILE_STATE_COVERED_FLAG = 12;

class Tile {
  constructor(element, grid, x, y) {
    this.element = element;
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.isMine = false;
    this.game = this.grid.game;
    this.setState(TILE_STATE_COVERED);

    let _self = this;
    // mouse events
    this.element.addEventListener("mousedown", function (e) {
      e = e || window.event;
      //   e.preventDefault();
      //   e.stopPropagation();
      if (e.which == 3) {
        _self.game.onTileRightClicked(_self);
      } else {
        _self.game.onTileLeftClicked(_self);
      }
    });
  }

  isCovered() {
    return (
      this.state == TILE_STATE_COVERED || this.state == TILE_STATE_COVERED_FLAG
    );
  }

  setState(state) {
    this.state = state;
    let text = "";
    if (this.state < TILE_STATE_MINE) {
      // uncovered
      this.element.classList.remove("mineTileHidden");
      this.element.classList.add("mineTileRevealed");
      switch (state) {
        case 1:
          text = '<span style="color: DodgerBlue">1</span>';
          break;
        case 2:
          text = '<span style="color: MediumSeaGreen">2</span>';
          break;
        case 3:
          text = '<span style="color: Tomato">3</span>';
          break;
        case 4:
          text = '<span style="color: SlateBlue">4</span>';
          break;
        case 5:
          text = '<span style="color: Violet">5</span>';
          break;
        case 6:
          text = '<span style="color: Orange">6</span>';
          break;
        case 7:
          text = '<span style="color: Black">7</span>';
          break;
        case 8:
          text = '<span style="color: Gray">8</span>';
          break;
      }
    } else if (this.state >= TILE_STATE_COVERED) {
      // covered
      this.element.classList.add("mineTileHidden");
      this.element.classList.remove("mineTileRevealed");
      if (state == TILE_STATE_COVERED) {
      } else if (state == TILE_STATE_COVERED_FLAG) {
        text = '<img src="./imgs/apps/mines/flag.png" />';
      }
    } else {
      // mine
      this.element.classList.add("mineTileHidden");
      this.element.classList.remove("mineTileRevealed");
      text = '<img src="./imgs/apps/mines/mine.png" />';
      if (state == TILE_STATE_MINE_RED) {
        this.element.classList.add("mineTileRedBG");
      }
    }
    this.element.innerHTML = text;
  }

  reset(isMine) {
    this.isMine = isMine;
    this.setState(TILE_STATE_COVERED);
  }
}

class Grid {
  constructor(element, game) {
    this.element = element;
    this.game = game;

    this.tiles = new Array(NUM_MINES_X);
    for (let index = 0; index < this.tiles.length; index++) {
      this.tiles[index] = new Array(NUM_MINES_Y);
    }

    this.reset();
  }

  reset() {
    this.element.innerHTML = "";
    for (let x = 0; x < NUM_MINES_X; x++) {
      for (let y = 0; y < NUM_MINES_Y; y++) {
        let tileElement = document.createElement("div");
        tileElement.setAttribute("class", "mineTile");
        tileElement.classList.add("mineTileHidden");
        this.element.appendChild(tileElement);
        let tile = new Tile(tileElement, this, x, y);
        this.tiles[x][y] = tile;
      }
    }
  }
}

export class Game {
  constructor(window) {
    this.window = window;
    this.contentElement = window.contentElement;
    let _self = this;

    this.gameElement = document.createElement("div");
    this.gameElement.setAttribute("id", "mineGame");
    this.contentElement.appendChild(this.gameElement);

    this.controlsElement = document.createElement("div");
    this.controlsElement.setAttribute("id", "mineControls");
    this.gameElement.appendChild(this.controlsElement);
    {
      let element = document.createElement("div");
      this.controlsElement.appendChild(element);
      element.setAttribute("id", "mineGameText01");
      element.innerHTML = "00";
      this.text01Element = element;

      element = document.createElement("div");
      this.controlsElement.appendChild(element);
      element.setAttribute("class", "mineButton");
      element.innerHTML = "reset";
      this.resetButtonElemnt = element;
      this.resetButtonElemnt.addEventListener("mousedown", function (e) {
        e = e || window.event;
        // e.preventDefault();
        // e.stopPropagation();
        _self.reset();
      });
      //   this.resetButtonElemnt.addEventListener("click", function (e) {
      //     e = e || window.event;
      //     e.preventDefault();
      //     e.stopPropagation();
      //   });

      element = document.createElement("div");
      this.controlsElement.appendChild(element);
      element.setAttribute("id", "mineGameText02");
      element.innerHTML = "00";
      this.text02Element = element;
    }

    this.gridElement = document.createElement("div");
    this.gridElement.setAttribute("id", "mineGrid");
    this.gameElement.appendChild(this.gridElement);
    this.grid = new Grid(this.gridElement, this);

    this.reset();
  }

  reset() {
    this.grid.reset();

    this.playerCanMove = true;
    this.numMoves = 0;
    this.numMines = 0;
    this.numFlags = 0;

    let maxMines = 30;
    for (let x = 0; x < NUM_MINES_X; x++) {
      for (let y = 0; y < NUM_MINES_Y; y++) {
        if (this.numMines < maxMines) {
          this.grid.tiles[x][y].reset(true);
          this.numMines++;
        } else {
          this.grid.tiles[x][y].reset(false);
        }
      }
    }
    // shuffle
    for (let x = 0; x < NUM_MINES_X; x++) {
      for (let y = 0; y < NUM_MINES_Y; y++) {
        let wasMine = this.grid.tiles[x][y].isMine;
        let a = this.getRandomInt(0, NUM_MINES_X);
        let b = this.getRandomInt(0, NUM_MINES_Y);
        this.grid.tiles[x][y].isMine = this.grid.tiles[a][b].isMine;
        this.grid.tiles[a][b].isMine = wasMine;
      }
    }

    this.updateUI(false);
  }

  getRandomInt(min, max) {
    //The maximum is exclusive and the minimum is inclusive
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  updateUI(incrementMoves) {
    if (incrementMoves) this.numMoves++;
    this.text01Element.innerHTML = "" + (this.numMines - this.numFlags);
    this.text02Element.innerHTML = "" + this.numMoves;
  }

  onTileLeftClicked(tile) {
    if (!this.playerCanMove) return;
    if (!tile.isCovered()) return;

    if (this.numMoves == 0) {
      let tries = 0;
      while (tile.isMine) {
        if (tries > 20) {
          console.log(
            "mines game: more than 20 tries to generate board without a mine in the first clicked tile! had to abandon the attempt."
          );
          break;
        }
        tries++;
        this.reset();
      }
    }

    if (tile.isMine) {
      this.mineClicked(tile);
      this.updateUI(true);
    } else {
      let adjacents = this.adjacentMines(tile.x, tile.y);
      tile.setState(adjacents);
      this.visited = null;
      this.floodFillUncover(tile.x, tile.y);
      this.updateUI(true);
      if (this.isFinished()) {
        //TODO: game finished -> show a win msg?
        this.reset();
      }
    }
  }

  onTileRightClicked(tile) {
    if (!this.playerCanMove) return;
    if (tile.state == TILE_STATE_COVERED) {
      tile.setState(TILE_STATE_COVERED_FLAG);
      this.numFlags++;
      this.updateUI(false);
    } else if (tile.state == TILE_STATE_COVERED_FLAG) {
      tile.setState(TILE_STATE_COVERED);
      this.numFlags--;
      this.updateUI(false);
    }
  }

  mineClicked(tile) {
    this.uncoverMines();
    tile.setState(TILE_STATE_MINE_RED);
    //TODO: game finished -> do something more?
    this.playerCanMove = false;
  }

  uncoverMines() {
    for (let x = 0; x < NUM_MINES_X; x++) {
      for (let y = 0; y < NUM_MINES_Y; y++) {
        let tile = this.grid.tiles[x][y];
        if (tile.isMine) {
          tile.setState(TILE_STATE_MINE);
        }
      }
    }
  }

  isMineAt(x, y) {
    if (x >= 0 && y >= 0 && x < NUM_MINES_X && y < NUM_MINES_Y)
      return this.grid.tiles[x][y].isMine;
    return false;
  }

  adjacentMines(x, y) {
    let count = 0;
    if (this.isMineAt(x, y + 1)) ++count; // top
    if (this.isMineAt(x + 1, y + 1)) ++count; // top-right
    if (this.isMineAt(x + 1, y)) ++count; // right
    if (this.isMineAt(x + 1, y - 1)) ++count; // bottom-right
    if (this.isMineAt(x, y - 1)) ++count; // bottom
    if (this.isMineAt(x - 1, y - 1)) ++count; // bottom-left
    if (this.isMineAt(x - 1, y)) ++count; // left
    if (this.isMineAt(x - 1, y + 1)) ++count; // top-left
    return count;
  }

  floodFillUncover(x, y) {
    if (this.visited == null) {
      this.visited = new Array(NUM_MINES_X);
      for (let x = 0; x < NUM_MINES_X; x++) {
        this.visited[x] = new Array(NUM_MINES_Y);
        for (let y = 0; y < NUM_MINES_Y; y++) {
          this.visited[x][y] = false;
        }
      }
    }

    if (x >= 0 && y >= 0 && x < NUM_MINES_X && y < NUM_MINES_Y) {
      if (this.visited[x][y] == true) return;

      let adjacentMinesNum = this.adjacentMines(x, y);
      this.grid.tiles[x][y].setState(adjacentMinesNum);
      if (adjacentMinesNum > 0) return;

      this.visited[x][y] = true;

      this.floodFillUncover(x - 1, y);
      this.floodFillUncover(x + 1, y);
      this.floodFillUncover(x, y - 1);
      this.floodFillUncover(x, y + 1);
    }
  }

  isFinished() {
    for (let x = 0; x < NUM_MINES_X; x++) {
      for (let y = 0; y < NUM_MINES_Y; y++) {
        let tile = this.grid.tiles[x][y];
        if (tile.isCovered() && !tile.isMine) {
          return false;
        }
      }
    }
    return true;
  }
}
