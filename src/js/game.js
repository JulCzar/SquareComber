/**
 * 
 * @param {number} width Grid width, default = 10
 * @param {number} height Grid height, default = 10
 */
export const createGameTable = (width = 10, height= 10) => {
  const grid = []
  const observers = []

  const createInitialGrid = () => {
    for(let i=0; i < height; i++)
      grid[i] = []
  
    for(let i=0; i < height; i++)
      for(let j=0; j < width; j++)
        grid[i][j] = Math.floor(Math.random() * 5)

    notifyAll()
  }

  const notifyAll = () => {
    console.log(`notifying ${observers.length} observers`)

    for (const observer of observers)
      observer(grid)
  }

  /**
   * @param {{movement: {x: number, y: number}, target: HTMLElement}} movementInfos 
   */
  const handleMovement = movementInfos => {
    const { movement, target } = movementInfos
    const { x, y } = movement
    const row = Number(target.attributes.row.value)
    const col = Number(target.attributes.col.value)

    if (row + y < 0 || col + x < 0 || col + x >= width || row + y >= height) return

    const aux = grid[row][col]
    grid[row][col] = grid[row+y][col+x]
    grid[row+y][col+x] = aux

    notifyAll()
  }

  const subscribe = observer => {
    observers.push(observer)
  }

  const start = () => {
    createInitialGrid()
  }

  return {
    grid,
    subscribe,
    start,
    handleMovement
  }
}