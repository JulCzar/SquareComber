export default class MovementInfo {
  /**
   * @param {-1 | 0 | 1} x 
   * @param {-1 | 0 | 1} y 
   * @param {'up' | 'down' | 'left' | 'right'} direction 
   */
  constructor(x, y, direction) {
    this.x = x
    this.y = y
    this.direction = direction
  }
}