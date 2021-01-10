import { sortValue } from '../utils/sortValue.js'

export default class Item {
  /**
   * @param {number} x x position of this item
   * @param {number} y y position of this item
   * @param {number} maxValue max value to be set for the item
   * @param {number} initialValue value to initialize the item
   */
  constructor (x, y, maxValue, initialValue) {
    if (x === undefined || typeof x !== 'number') throw new Error('X position value not provided or provided an invalid one! valid => any number higher than 0')
    if (y === undefined || typeof y !== 'number') throw new Error('Y position value not provided or provided an invalid one! valid => any number higher than 0')
    if (!maxValue || typeof maxValue !== 'number') throw new Error('max value not provided or provided an invalid one! valid => any number higher than 0')
    
    this.value = initialValue || sortValue(maxValue)
    this.position =  { x, y }
    
    this.sortNewValue = () => {
      this.value = sortValue(maxValue)
    }
  }

  getX() { return this.position.x }
  getY() { return this.position.y }

  isEmpty() { return (typeof this.value !== 'number') }

  popValue() {
    const value = this.value
    this.value = null

    return value
  }
}