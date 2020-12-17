import MovementInfo from './models/movement.js'

/**
 * @param {string} animatedInterface the interface selector to animate
 * @param {number} animationThreshold default 400ms
 */
export const getAnimationEngine = (animationThreshold = 250) => {
  console.log('animation engine started')

  const style = document.createElement('style')
  style.innerText = `body {--animationDuration: ${animationThreshold*2}ms;}`
  document.head.append(style)
  
  const observers = []

  const subscribe = observer => {
    observers.push(observer)
    
    console.log(`${observers.length} observers subscribed to execute at animation end`)
  }

  /**
   * @param {HTMLElement} target 
   * @param {MovementInfo} movement 
   */
  const notifyAll = (movement, target) => {
    console.log(`notifying ${observers.length} observers about an animation start`)

    for (const observer of observers) {
      observer(movement, target, animationThreshold)
    }
  }

  /**
   * @param {HTMLElement} target 
   * @param {MovementInfo} movement 
   */
  const fireAnimation = (target, movement) => {
    const { x, y, direction } = movement
    const row = Number(target.attributes.row.value)
    const col = Number(target.attributes.col.value)

    target.classList.add(`movement_${direction}`)

    for (const gem of document.querySelectorAll('.gem')) {
      const oppositeDirection = MovementInfo.getOppositeDirection(direction)
      const gemRow = Number(gem.attributes.row.value)
      const gemCol = Number(gem.attributes.col.value)

      if (gemRow == (row + y) && gemCol == (col + x))
        gem.classList.add(`movement_${oppositeDirection}`)
    }
  }
  /**
   * @param {HTMLElement} target 
   * @param {MovementInfo} movement 
   */
  const removeAnimation = (target, movement) => {
    const { x, y, direction } = movement
    const row = Number(target.attributes.row.value)
    const col = Number(target.attributes.col.value)

    target.classList.remove(`movement_${direction}`)

    for (const gem of document.querySelectorAll('.gem')) {
      const oppositeDirection = MovementInfo.getOppositeDirection(direction)
      const gemRow = Number(gem.attributes.row.value)
      const gemCol = Number(gem.attributes.col.value)

      if (gemRow == (row + y) && gemCol == (col + x))
        gem.classList.remove(`movement_${oppositeDirection}`)
    }
  }
  /**
   * @param {MovementInfo} movement 
   * @param {HTMLElement} target
   */
  const handleMovementAnimation = (movement, target) => {
    notifyAll(movement, target)

    fireAnimation(target, movement)

    setTimeout(() => removeAnimation(target, movement), animationThreshold*2)
  }

  return {
    handleMovementAnimation,
    subscribe
  }
}