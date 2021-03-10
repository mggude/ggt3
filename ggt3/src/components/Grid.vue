<template>
  <div class="container">
    <h1 id="header">{{ headerText }}</h1>
    <h2>You are {{ me }}</h2>
    <button class="button" @click="resetGrid">RESET</button>
    <div v-for="row in grid" :key="row" class="row">
      <div v-for="cell in row" :key="cell" class="cell" @click="play(cell)">
        <span :class="cell.mark ? 'visible-text' : ''">{{
          cell.mark || "X"
        }}</span>
      </div>
    </div>
  </div>
</template>
<script>

// @ is an alias to /src
import {
  connectToFirebase,
  getGridRef,
  getWhoseTurnIsItRef,
  setDefaultsInFirebase,
  getConnectionsRef,
} from "../db/logic"

export default {
  name: "Grid",
  data: () => ({
    grid: [],
    whoseTurnIsIt: "X",
    win: false,
    catsGame: false,
    winner: "",
    me: "",
  }),
  computed: {
    headerText() {
      if (this.win) {
        return `${this.winner} WINS!`
      }
      if (this.catsGame) {
        return "😸"
      }
      return "TIC TAC TOE"
    },
    itsMyTurn() {
      return this.me === this.whoseTurnIsIt
    },
  },
  mounted() {
    // assign player their mark
    this.resetGrid()
    connectToFirebase()
    setDefaultsInFirebase(this.grid)
    this.listenForConnections()
    this.listenForPlays()
  },
  methods: {
    getDefaultGrid() {
      return [
        [
          { location: "00", mark: "" },
          { location: "01", mark: "" },
          { location: "02", mark: "" },
        ],
        [
          { location: "10", mark: "" },
          { location: "11", mark: "" },
          { location: "12", mark: "" },
        ],
        [
          { location: "20", mark: "" },
          { location: "21", mark: "" },
          { location: "22", mark: "" },
        ],
      ]
    },
    play(cell) {
      if (cell.mark || this.win || !this.itsMyTurn) {
        return
      }
      // mark this cell (in grid) as whoseTurnIsIt (x or o)
      const newMark = this.whoseTurnIsIt
      const locationRow = cell.location[0]
      const locationCol = cell.location[1]
      this.grid[locationRow][locationCol].mark = newMark
      this.checkWin()
      // change whoseTurnIsIt to the other player
      if (this.win) {
        this.winner = this.whoseTurnIsIt
      }
      if (!this.win) {
        this.whoseTurnIsIt = this.whoseTurnIsIt === "X" ? "O" : "X"
      }
      this.updateGridInFirebase()
      this.updateWhoseTurnIsItFirebase()
    },
    checkRow(row) {
      let win = true
      const firstCellMark = row[0].mark
      row.forEach((cell) => {
        if (cell.mark === "") {
          win = false
        }
        if (firstCellMark !== cell.mark) {
          win = false
        }
      })
      return win
    },
    getCol(colNum) {
      const col = []
      this.grid.forEach((row) => {
        col.push(row[colNum])
      })
      return col
    },
    // Future dev: combine with checkRow
    checkCol(col) {
      let win = true
      const firstCellMark = col[0].mark
      col.forEach((cell) => {
        if (cell.mark === "") {
          win = false
        }
        if (firstCellMark !== cell.mark) {
          win = false
        }
      })
      return win
    },
    checkWin() {
      let win = false;
      [0, 1, 2].forEach((index) => {
        if (this.checkCol(this.getCol(index))) {
          win = true
        }
      })
      this.win = win
      if (win) return
      this.grid.forEach((row) => {
        if (this.checkRow(row)) {
          win = true
        }
      })
      this.win = win
      if (win) return
      if (this.checkDiagonAlley()) {
        win = true
      }
      this.win = win
      if (!win) {
        this.catsGame = this.checkCat()
      }
    },
    checkDiagonAlley() {
      const middleCell = this.grid[1][1].mark // {location: '21', mark: ''}
      const topLeftCell = this.grid[0][0].mark
      const bottomRightCell = this.grid[2][2].mark
      const topRightCell = this.grid[0][2].mark
      const bottomLeftCell = this.grid[2][0].mark
      if (middleCell === "") return false
      if (middleCell === topLeftCell && middleCell === bottomRightCell)
        return true
      if (middleCell === topRightCell && middleCell === bottomLeftCell)
        return true
    },
    checkCat() {
      let fullGrid = true
      this.grid.forEach((row) => {
        row.forEach((cell) => {
          if (cell.mark === "") {
            fullGrid = false
          }
        })
      })
      return fullGrid
    },
    updateGridInFirebase() {
      const gridRef = getGridRef()
      gridRef.set(this.grid)
    },
    updateWhoseTurnIsItFirebase() {
      const whoseTurnIsItRef = getWhoseTurnIsItRef()
      whoseTurnIsItRef.set(this.whoseTurnIsIt)
    },
    listenForConnections() {
      const connectionsRef = getConnectionsRef()
      connectionsRef.on("value", (snap) => {
        const numPlayers = snap.numChildren()
        if (numPlayers < 2) {
          // first player!
          console.log("setting me to X")
          this.me = "X"
        } else {
          if (!this.me) {
            console.log("setting me to O")
            // me hasn't been set (second player) -> they're "o"
            this.me = "O"
          }
        }
      })
    },
    listenForPlays() {
      const whoseTurnIsItRef = getWhoseTurnIsItRef()
      const gridRef = getGridRef()
      whoseTurnIsItRef.on("value", (snap) => {
        if (snap.val()) {
          this.whoseTurnIsIt = snap.val()
        }
      })
      gridRef.on("child_changed", (snap) => {
        if (snap.val()) {
          this.getGrid()
        }
      })
    },
    getGrid() {
      const gridRef = getGridRef()
      gridRef.get().then((data) => {
        this.grid = data.val()
        this.checkWin()
        if (this.win) {
          // if win, set winner to whose turn it WAS
          this.winner = this.whoseTurnIsIt
        }
      })
    },
    resetGrid() {
      this.grid = this.getDefaultGrid()
      setDefaultsInFirebase(this.grid)
    },
  },
}
</script>

<style lang="scss">
.container {
  margin: auto;
  width: 70%;
}

.row {
  display: flex;
  justify-content: center;
  margin: auto;
  width: 80%;
}

.cell {
  background-color: #ff6c00;
  border: 1px solid #ff6c00;
  color: #ff6c00;
  border-radius: 1rem;
  padding: 3rem;
  margin: 1rem;
  font-size: 5rem;
  min-width: 100px;
  cursor: pointer;
}

.visible-text {
  color: #fff;
}

.button {
  padding: 0.5rem;
  color: #fff;
  border-radius: 0.5rem;
  background-color: #86cad2;
  border: 1px solid #86cad2;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
