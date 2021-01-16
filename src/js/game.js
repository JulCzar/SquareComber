import Combo from './models/combo.js'
import Item from './models/item.js'
import MovementInfo from './models/movement.js'

const EMPTY_ITEM = new Item(-1, -1, 2, -1 )
const REGISTERED_ITEMS_QUANTITY = 5

export const createGameEnvironment = ({ width = 4, height = 4, animationDuration }) => {
  const grid = [[EMPTY_ITEM]]
  const observers = []

  /**
   * @param {(gridData: grid) => void} observer 
   */
  const subscribe = observer => {
    observers.push(observer)
  }

  const notifyAll = () => {
    const publicGrid = grid.map(row => row.map(i => i.value))

    console.log(`notifying ${observers.length} observers about a grid change`)

    for (const observer of observers) observer(publicGrid)

    updateGridValues()
  }

  const generateItem = () => Math.floor(Math.random() * 5)

  const createInitialGrid = () => {
    for(let y=0; y<height; y++) {
      grid[y] = [EMPTY_ITEM]

      for(let x=0; x<width; x++)
        grid[y][x] = new Item(x, y, REGISTERED_ITEMS_QUANTITY)
    }
    
    notifyAll()
  }

  const updateGridValues = () => {
    function getItemAbove(x, y) {
      for (let i=height-1; i>=0; i--) {
        for (const item of grid[i]) {
          const { position } = item

          if (position.x !== x) continue
          if (position.y !== y-1) continue

          return item
        }
      }

      return EMPTY_ITEM
    }

    /**
     * @param {Item} item 
     * @returns {number}
     */
    const dropValueAbove = item => {
      const { x, y } = item.position

      if (y<=0) return -1

      const itemAbove = getItemAbove(x, y)

      if (itemAbove.isEmpty()) return dropValueAbove(itemAbove)

      return itemAbove.popValue()
    }

    const update = () => {
      for (let y=0; y<height;y++) {
        for (let x=0; x<width;x++) {
          if (!grid[y][x].isEmpty()) {
            if (y+1>=height) continue
  
            if (grid[y+1][x].isEmpty()) {
              grid[y+1][x].value = grid[y][x].popValue()
            }
          }
        }
      }
    }

    const verifyGrid = () => {
      for (let y=0; y<height;y++) {
        for (let x=0; x<width;x++) {
          if (!grid[y][x].isEmpty()) {
            if (y+1>=height) continue
            if (grid[y+1][x].isEmpty()) {
              return true
            }
          }
        }
      }
      return false
    }

    const fillEmptyValues = () => {
      for (const row of grid) {
        for (const item of row) {
          if (item.isEmpty()) {
            item.sortNewValue()
          }
        }
      }
    }

    update()

    const hasToBeRecursive = verifyGrid()

    if (hasToBeRecursive) updateGridValues()
    else fillEmptyValues()
  }

  /**
   * @param {Combo[]} comboList 
   */
  const reduceComboList = comboList => {}

  const findHorizontalCombos = () => {
    const combos = []

    for (let y=0; y<height; y++) {
      for (let x=0;x<width-2;x++) {

        const [item1, item2, item3] = [grid[y][x], grid[y][x+1], grid[y][x+2]]

        const item1EqualsItem2 = item1.value === item2.value
        const item2EqualsItem3 = item2.value === item3.value

        const isACombo = item1EqualsItem2&&item2EqualsItem3 && !item1.isEmpty()

        if (isACombo)
          combos.push(new Combo('horizontal', 3, [item1, item2, item3]))
      }
    }

    // const reducedCombos = reduceCombos(combos)

    return combos
  }

  const findVerticalCombos = () => {
    const combos = []

    for (let y=0; y<height-2; y++) {
      for (let x=0; x<width; x++) {
        const [item1, item2, item3] = [grid[y][x], grid[y+1][x], grid[y+2][x]]

        const item1EqualsItem2 = item1.value === item2.value
        const item2EqualsItem3 = item2.value === item3.value

        const isACombo = item1EqualsItem2 && item2EqualsItem3 && !item1.isEmpty()

        const items = [item1, item2, item3]

        if (isACombo) combos.push(new Combo('vertical', 3, items))
      }
    }

    // const reducedCombos = reduceCombos(combos)

    return combos
  }

  const findCombos = () => {
    const horizontalCombos = findHorizontalCombos()
    const verticalCombos = findVerticalCombos()

    const combos = [...horizontalCombos, ...verticalCombos]

    return combos;
  }

  /**
   * @param {Combo[]} comboList 
   */
  const removeCombos = comboList => {
    if (!comboList.length) return

    for (const combo of comboList)
      for (const item of combo.items)
        item.popValue()

    console.log(`removed ${comboList.length} combos from grid`)
  }

  const handleCombos = () => {
    const combos = findCombos(grid)

    console.log(`found ${combos.length} valid combos.`)

    removeCombos(combos)

    updateGridValues()

    if (combos.length) handleCombos()
  }

  const updateItemPosition = (row, col, x, y) => {
    const aux = grid[row][col]
    const sideItem = grid[row+y][col+x]
    
    if (aux.isEmpty() || sideItem.isEmpty()) return

    grid[row][col] = grid[row+y][col+x]
    grid[row+y][col+x] = aux
  }

  /**
   * @param {{movement: MovementInfo, target: HTMLElement}} movementInfos 
   */
  const handleMovement = ({ movement, target }) => {
    const { x, y, direction } = movement
    const row = Number(target.attributes.row.value)
    const col = Number(target.attributes.col.value)

    const rowIsValid = row + y >= 0 && row + y <= height
    const colIsValid = col + x >= 0 && col + x <= width

    if (!rowIsValid || !colIsValid) return

    updateItemPosition(row, col, x, y)

    console.log(`moving ${row}-${col} ${direction}`)

    const combos = findCombos(grid)

    if (!combos.length)  {
      updateItemPosition(row, col, x, y)

      console.log('invalid move')
    }
    else {
      handleCombos()

      setTimeout(notifyAll, animationDuration)
    }

    updateGridValues()
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