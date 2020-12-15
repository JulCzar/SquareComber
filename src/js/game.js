class Combo {
  /**
   * @param {string} type 
   * @param {number} length 
   * @param {{x:number, y:number}[]} positions 
   */
  constructor(type, length, positions) {
    this.type = type
    this.length = length
    this.positions = positions
  }
}

/**
 * @param {number} width Grid width, default = 10
 * @param {number} height Grid height, default = 10
 */
export const createGameTable = (width = 10, height= 10) => {
  const grid = [[0]]
  const observers = []

  /**
   * @param {(gridData: grid) => void} observer 
   */
  const subscribe = observer => {
    observers.push(observer)
  }

  const notifyAll = () => {
    console.log(`notifying ${observers.length} observers about a grid change`)

    for (const observer of observers)
      observer([...grid])
  }

  const createInitialGrid = () => {
    for(let i=0; i < height; i++)
      grid[i] = []
  
    for(let i=0; i < height; i++)
      for(let j=0; j < width; j++)
        grid[i][j] = Math.floor(Math.random() * 5)

    notifyAll()
  }

  const updateGridValues = () => {
    let hasGap = false;
    for (let i=1; i<=height; i++) {
      const row = height-i
      for (let col=0; col<width; col++) {
        if (row === 0) {
          if(grid[row][col] == -1) {
            grid[row][col] = Math.floor(Math.random() * 5)
            hasGap = true
          }
        }else {
          if(grid[row][col] == -1) {
            grid[row][col] = grid[row-1][col]
            grid[row-1][col] = -1
          }
        }
      }
    }
    if (hasGap) updateGridValues()
  }

  const findCombos = grid => {
    const combos = []

    for (let y=0;y<height; y++)
      for (let x=0; x<width-2; x++)
        if ((grid[y][x] == grid[y][x+1] && grid[y][x+1] == grid[y][x+2]) && grid[y][x] != -1)
          combos.push(new Combo('line', 3, [
            {x,y, value: grid[y][x]},
            {x: x+1,y, value: grid[y][x+1]},
            {x: x+2,y, value: grid[y][x+2]}
          ]))

    for (let y=0;y<height-2; y++)
      for (let x=0; x<width; x++)
        if (((grid[y][x] == grid[y+1][x]) && (grid[y+1][x] == grid[y+2][x])) && grid[y][x] != -1)
          combos.push(new Combo('line', 3, [
            {x,y, value: grid[y][x]},
            {x,y: y+1, value: grid[y+1][x]},
            {x,y: y+2, value: grid[y+2][x]}
          ]))

    return combos;
  }

  /**
   * @param {Combo[]} comboList 
   */
  const removeCombos = comboList => {
    for (const combo of comboList)
      for (const pos of combo.positions)
        grid[pos.y][pos.x] = -1
  }

  const handleCombos = () => {
    let combos = []
    do {
      combos = findCombos(grid)
      removeCombos(combos)
      updateGridValues()
    }while (combos.length)
  }

  const updateItemPosition = (row, col, x, y) => {
    const aux = grid[row][col]
    grid[row][col] = grid[row+y][col+x]
    grid[row+y][col+x] = aux
  }

  /**
   * @param {{movement: {x: number, y: number}, target: HTMLElement}} movementInfos 
   */
  const handleMovement = movementInfos => {
    const { movement, target } = movementInfos
    const { x, y, name } = movement
    const row = Number(target.attributes.row.value)
    const col = Number(target.attributes.col.value)

    if (row + y < 0 || col + x < 0 || col + x >= width || row + y >= height) return

    updateItemPosition(row, col, x, y)

    console.log(`moving ${row}-${col} ${name}`)

    notifyAll()

    const combos = findCombos(grid)

    if (!combos.length) setTimeout(() => {
      updateItemPosition(row, col, x, y)

      console.log('invalid move')

      notifyAll()
    }, 100)
    else {
      handleCombos()

      notifyAll()
    }
  }

  /**
   * Function that create the initial grid and notify all observers about the grid layout
   */
  const start = () => {
    createInitialGrid()

    handleCombos()
    
    notifyAll()
  }

  return {
    subscribe,
    start,
    handleMovement
  }
}