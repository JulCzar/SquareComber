import MovementInfo from './models/movement.js'

export const getAnimationEngine = ({
  width = 4,
  height = 4,
  animationDuration = 250,
  animatedInterface
}) => {
  if (!animatedInterface) throw new Error('target interface of animation engine not declared')

  console.log('animation engine started')

  const style = document.createElement('style')
  style.innerText = `body {--animationDuration: ${animationDuration*2}ms;}`
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
      observer(movement, target, animationDuration)
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

    for (const gem of document.querySelectorAll(animatedInterface)) {
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

    for (const gem of document.querySelectorAll(animatedInterface)) {
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

    setTimeout(() => removeAnimation(target, movement), animationDuration*2)
  }

  return {
    handleMovementAnimation,
    subscribe
  }
}