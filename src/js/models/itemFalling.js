export default class ItemFalling {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} fall
   */
  constructor(x, y, fall) {
    this.position = { x, y }
    this.fall = fall
  }
}