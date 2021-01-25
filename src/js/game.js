import MovementInfo from './models/movement.js'
import Combo from './models/combo.js'
import Item from './models/item.js'

import { doAfter } from './utils/wait.js'

const EMPTY_ITEM = new Item(-1, -1, 2, -1)
const REGISTERED_ITEMS_QUANTITY = 5

export const createGameEnvironment = ({ width = 4, height = 4, animationDuration }) => {
  const grid = [[EMPTY_ITEM]]
  const observers = []
  const state = {
    lock: {
      externalGridChanges: false
    }
  }

  const lockExternalGridChanges = () => {
    console.log('locking grid to external changes')
    state.lock.externalGridChanges = true
  }
  const unlockExternalGridChanges = () => {
    console.log('unlocking grid to external changes')
    state.lock.externalGridChanges = false
  }

  /**
   * @param {(gridData: number[][], gridChanges:number[][]) => void} observer 
   */
  const subscribe = observer => {
    observers.push(observer)
  }

  const notifyAll = () => {
    const publicGrid = grid.map(row => row.map(i => i.value))
    const gridChanges = grid.map(row => row.map(i => i.getFallCount()))

    console.log(`notifying ${observers.length} observers about a grid change`)

    for (const observer of observers) observer(publicGrid, gridChanges)
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
    const dropValuesOnce = () => {
      const reverseGrid = [...grid].reverse()

      for (let y=0;y<height;y++) {
        const row = reverseGrid[y]
        const rowAbove = reverseGrid[y+1] || []

        for (let x=0; x<width; x++) {
          const item = row[x]
          const itemAbove = rowAbove[x] || EMPTY_ITEM

          if (item.isEmpty()) {
            item.value = itemAbove.popValue()
            item.increaseFall()
          }
        }
      }
    }

    const hasFloatingItems = () => {
      for (let y=0; y<height;y++) {
        const row = grid[y]
        const rowBellow = grid[y+1] || []

        for (let x=0; x<width;x++) {
          const currentItem = row[x]
          const itemBellow = rowBellow[x]

          if (!currentItem.isEmpty()) {
            if (y+1>=height) continue

            if (itemBellow.isEmpty()) return true
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

    do { dropValuesOnce() } while (hasFloatingItems())

    fillEmptyValues()
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
    for (const combo of comboList)
      for (const item of combo.items)
        item.popValue()

    console.log(`removed ${comboList.length} combos from grid`)
  }

  /**
   * 
   * @param {*} animDuration 
   */
  const handleCombos = async (animDuration = animationDuration) => {
    const notifyObservers = () => {
      notifyAll()

      handleCombos(animDuration)
    }

    const combos = findCombos(grid)

    console.log(`found ${combos.length} valid combos.`)
    
    if (!combos.length) return unlockExternalGridChanges()

    removeCombos(combos)
    
    updateGridValues()

    if (animDuration)
      await doAfter(notifyObservers, animDuration)
    else {
      notifyObservers()
    }
  }

  const updateItemPosition = (row, col, { x, y, direction }) => {
    const isMovingOutsideGrid = () => {
      const isMovingFirstRowUp = row===0 && direction === 'up'
      const isMovingLastRowDown = row===height-1 && direction === 'down'
      const isMovingFirstColumnLeft = col===0 && direction === 'left'
      const isMovingLastColRight = col===height-1 && direction === 'right'

      return isMovingFirstRowUp || isMovingLastRowDown || isMovingFirstColumnLeft || isMovingLastColRight
    }
    if (isMovingOutsideGrid()) return

    const aux = grid[row][col]
    const sideItem = grid[row+y][col+x]
    
    if (!aux || !sideItem || aux.isEmpty() || sideItem.isEmpty()) return

    grid[row][col] = grid[row+y][col+x]
    grid[row+y][col+x] = aux
  }

  /**
   * @param {{movement: MovementInfo, target: HTMLElement}} movementInfos 
   */
  const handleMovement = ({ movement, target }) => {
    if (state.lock.externalGridChanges) return console.warn('touch event ignored due to lock state')

    lockExternalGridChanges()

    const { x, y, direction } = movement
    const row = Number(target.attributes.row.value)
    const col = Number(target.attributes.col.value)

    const rowIsValid = row + y >= 0 && row + y <= height
    const colIsValid = col + x >= 0 && col + x <= width

    if (!rowIsValid || !colIsValid) return unlockExternalGridChanges()

    updateItemPosition(row, col, movement)

    console.log(`moving ${row}-${col} ${direction}`)

    const combos = findCombos(grid)

    if (!combos.length)  {
      updateItemPosition(row, col, x, y)

      console.log('invalid move')

      unlockExternalGridChanges()
    }
    else handleCombos()
  }

  /**
   * Function that create the initial grid and notify all observers about the grid layout
   */
  const start = () => {
    createInitialGrid()

    handleCombos(0)
    
    notifyAll()
  }

  return {
    subscribe,
    start,
    handleMovement
  }
}