<template>
<div class="container">
    <h1 id="header">{{ headerText }}</h1>
    <div v-for="row in grid" :key="row" class="row">
      <div v-for="cell in row" :key="cell" class="cell" @click="play(cell)">
        <span :class="cell.mark ? 'visible-text' : ''">{{ cell.mark || 'X' }}</span>
      </div>
    </div>
</div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Grid',
  data: () => ({
    grid: [
        [{location: '00', mark: ''}, {location: '01', mark: ''}, {location: '02', mark: ''}],
        [{location: '10', mark: ''}, {location: '11', mark: ''}, {location: '12', mark: ''}],
        [{location: '20', mark: ''}, {location: '21', mark: ''}, {location: '22', mark: ''}],
    ],
    whoseTurnIsIt: 'X',
    win: false
  }),
  computed: {
    headerText(){
      if (this.win) {
        return `WINNER`
      } 
      return `TIC TAC TOE`
    }
  },
  methods: {
    play(cell) {
      if (cell.mark || this.win) {
        return
      }
      // mark this cell (in grid) as whoseTurnIsIt (x or o)
      const newMark = this.whoseTurnIsIt 
      const locationRow = cell.location[0]
      const locationCol = cell.location[1]
      this.grid[locationRow][locationCol].mark = newMark 
      //this.checkWin()
      console.log("did you win?" + this.checkWin());
      // change whoseTurnIsIt to the other player
      this.whoseTurnIsIt = this.whoseTurnIsIt === 'X' ? 'O' : 'X'

    },
    checkRow(row) {
      // [{location: '20', mark: ''}, {location: '21', mark: ''}, {location: '22', mark: ''}]
      let win = true
      const firstCellMark = row[0].mark // => 'x'
      row.forEach(cell => {
        if (cell.mark === '') {
          win = false;
        }
        // {location: '20', mark: ''}
        if (firstCellMark !== cell.mark) {
          win = false
        }
      }) 
      return win
    },
    getCol(colNum) {
      const col = []
      this.grid.forEach(row => {
        col.push(row[colNum])
      }) 
      return col
    },
    checkCol(col) {
      let win = true
      const firstCellMark = col[0].mark // => 'x'
      col.forEach(cell => {
        if (cell.mark === '') {
          win = false
        }
        // {location: '20', mark: ''}
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
      this.grid.forEach(row => {
        if (this.checkRow(row)) {
          win = true
        }
      })
      if (this.checkDiagonAlley()) {
        win = true
      }
      this.win = win
      return win
    },
    checkDiagonAlley() {
      const middleCell = this.grid[1][1].mark // {location: '21', mark: ''}
      const topLeftCell = this.grid[0][0].mark
      const bottomRightCell = this.grid[2][2].mark
      const topRightCell = this.grid[0][2].mark
      const bottomLeftCell = this.grid[2][0].mark
      if (middleCell === '') return false
      if (middleCell === topLeftCell && middleCell === bottomRightCell) return true
      if (middleCell === topRightCell && middleCell === bottomLeftCell) return true
    },
  }
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
}

.visible-text {
  color: #fff;
}

</style>
