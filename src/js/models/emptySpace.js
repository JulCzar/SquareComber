import Position from "./position.js";

export default class EmptySpace {
  /**
   * @param {Position} lowest 
   * @param {number} height 
   */
  constructor(lowest, height) {
    this.lowest = lowest
    this.height = height
  }

  increaseHeight() {
    this.height++
  }
}