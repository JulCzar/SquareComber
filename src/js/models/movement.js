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

  /**
   * @param {'up' | 'down' | 'left' | 'right'} direction
   * @returns {'up' | 'down' | 'left' | 'right'}
   */
  static getOppositeDirection(direction) {
    return {
      up: 'down',
      right: 'left',
      down: 'up',
      left: 'right'
    }[direction]
  }
}