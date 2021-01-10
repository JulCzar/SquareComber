import Combo from './models/combo.js'
import Item from './models/item.js'
import MovementInfo from './models/movement.js'

const EMPTY_ITEM = new Item(-1, -1, 2, -1 )
const REGISTERED_ITEMS_QUANTITY = 5

export const createGameTable = ({ width = 4, height = 4, animationDuration }) => {
  const grid = [[EMPTY_ITEM]]
  const observers = []

  /**
   * @param {(gridData: grid) => void} observer 
   */
  const subscribe = observer => {
    observers.push(observer)
  }

  const notifyAll = () => {
    const publicGrid = []

    for (let i=0;i<height;i++) {
      publicGrid[i] = []

      for (let j=0;j<width;j++) {
        publicGrid[i][j] = grid[i][j].value
      }
    }

    console.log(`notifying ${observers.length} observers about a grid change`)

    for (const observer of observers) observer(publicGrid)
  }

  const createInitialGrid = () => {
    for(let y=0; y<height; y++) {
      grid[y] = [EMPTY_ITEM]

      for(let x=0; x<width; x++)
        grid[y][x] = new Item(x, y, REGISTERED_ITEMS_QUANTITY)
    }
    
    notifyAll()
  }

  const updateGridValues = () => {
    /**
     * @param {Item} item 
     * @returns {number | null}
     */
    const dropValueAbove = item => {
      const { x, y } = item.position

      if (y === 0) return null

      const itemAbove = grid[y-1][x]

      if (itemAbove.isEmpty()) return dropValueAbove(itemAbove)
      // if (itemAbove === EMPTY_ITEM) return null

      return itemAbove.popValue()
    }

    for (const row of grid) {
      for (const item of row) {
        if (item.isEmpty()) {
          const valueAbove = dropValueAbove(item)

          item.value = valueAbove
        }
      }
    }
    
    for (const row of grid) {
      for (const item of row) {
        if (item.isEmpty()) {
          item.sortNewValue()
        }
      }
    }
  }

  /**
   * @param {Combo[]} comboList 
   */
  const reduceCombos = comboList => {
    let reducedComboList = [...comboList]

    for (let i=0; i<(comboList.length-1); i++)
      for (let j=i+1; j<comboList.length; j++) 
        if (comboList[j].isSequenceOf(comboList[i])) {
          reducedComboList.push(Combo.reduceCombo(comboList[i], comboList[j]))
          reducedComboList = reducedComboList.filter(a => ![comboList[i], comboList[j]].includes(a))
        }

    return reducedComboList
  }

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

    console.log(`found ${combos.length} valid combos.`)

    return combos;
  }

  /**
   * @param {Combo[]} comboList 
   */
  const removeCombos = comboList => {
    for (const combo of comboList)
      for (const item of combo.items)
        item.popValue()
        
    console.log(`removed ${comboList.length} combos from grid`)
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