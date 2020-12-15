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

  const subscribe = observer => {
    observers.push(observer)
  }

  const start = () => {
    createInitialGrid()
  }

  return {
    grid,
    subscribe,
    start
  }
}