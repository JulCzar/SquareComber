export default class Position {
  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} value 
   */
  constructor(x, y, value) {
    this.x = x
    this.y = y
    this.value = value
  }

  /**
   * @param {Position} position 
   */
  equals(position) {
    if (this === position)
      return true

    if (typeof this !== typeof position)
      return false

    const { x, y, value } = position
    if (this.x === x && this.y === y && this.value == value)
      return true
    
    return false
  }
}