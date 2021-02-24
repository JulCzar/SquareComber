import { sortValue } from '../utils/sortValue';
import Item from './Item';

const EMPTY_ITEM = new Item(-1, -1, 2, -1)

const REGISTERED_ITEMS_QUANTITY = 5

export default class Grid {
  /**
   * 
   * @param {number} width number of columns the grid will have
   * @param {number} height number of rows the grid will have
   */
  constructor(width, height) {
    this.grid = [[EMPTY_ITEM]]
    this.lockState = false
    this.width = width
    this.height = height

    for(let y=0; y<this.height; y++) {
      this.grid[y] = [EMPTY_ITEM]
      const currentRow = this.grid[y]

      for(let x=0; x<this.width; x++)
        currentRow[x] = new Item(x, y, sortValue(REGISTERED_ITEMS_QUANTITY), REGISTERED_ITEMS_QUANTITY)
    }
  }

  static getEmptyItem() {
    return EMPTY_ITEM
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  getItem(x, y) {
    return this.grid[y][x]
  }

  /**
   * 
   * @param {Item} item 
   */
  getItemAbove(item) {
    const { x, y } = item.position
    if (!y) return EMPTY_ITEM
    return this.grid[y-1][x]
  }

  getGrid() {
    return this.grid
  }
}