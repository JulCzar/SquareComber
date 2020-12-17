import Position from './position.js'

export default class Combo {
  /**
   * @param {string} type 
   * @param {number} length 
   * @param {Position[]} positions 
   */
  constructor(type, length, positions) {
    this.type = type
    this.length = length
    this.positions = positions
  }

  /**
   * @param {Combo} combo 
   */
  isSequenceOf(combo) {
    for (const pos of this.positions)
      for (const combo_pos of combo.positions)
        if (pos.equals(combo_pos))
          return true

    return false
  }

  /**
   * @param {Combo} combo1 
   * @param {Combo} combo2 
   */
  static reduceCombo(combo1, combo2) {
    const totalComboList = [...combo1.positions, ...combo2.positions]
    const reducedPositionList = totalComboList.reduce((acc, val) => {
      let isAlreadyIn = false

      for (const pos of acc)
        if (pos.equals(val))
          isAlreadyIn = true

      if (isAlreadyIn)
        return acc
      return [...acc, val]
    }, [])

    return new Combo('reduced', reducedPositionList.length, reducedPositionList)
  }
}