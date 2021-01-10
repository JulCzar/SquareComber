import Item from './item.js'

export default class Combo {
  /**
   * @param {string} type 
   * @param {number} length 
   * @param {Item[]} items 
   */
  constructor(type, length, items) {
    this.type = type
    this.length = length
    this.items = items
  }

  /**
   * @param {Combo} combo 
   */
  isSequenceOf(combo) {
    for (const pos of this.items)
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
    const totalPositionList = [...combo1.positions, ...combo2.positions]
    const reducedPositionList = []

    for (const pos of totalPositionList) {
      let isPosAlreadyOnList = false

      for (const checkedPos of reducedPositionList)
        if (pos.equals(checkedPos)) isPosAlreadyOnList = true

      if (!isPosAlreadyOnList) reducedPositionList.push(pos)
    }

    return new Combo('reduced', reducedPositionList.length, reducedPositionList)
  }

  /**
   * 
   * @param {Combo[]} comboList 
   */
  static isReducible(comboList) {
    for (let i=0; i<(comboList.length-1);i++)
      for (let j=i+1; j<comboList.length;j++)
        if (comboList[i].isSequenceOf(comboList[j]))
          return true

    return false
  }
}