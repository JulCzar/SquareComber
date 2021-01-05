import MovementInfo from './models/movement.js'

export const getAnimationEngine = ({
  width = 4,
  height = 4,
  gridSize,
  animationDuration = 250,
  animatedInterface
}) => {
  if (!animatedInterface) throw new Error('target interface of animation engine not declared')
  const observers = []

  const generateDropAnimations = () => {
    const dropCss = []

    for (let i=height; i>0; i--) {
      dropCss.push(`@keyframes drop-${i}-blocks { 0% { transform: translateY(-${i*gridSize}) }; 100% {} }`)
      dropCss.push(` .drop-${i}-blocks { animation: drop-${i}-blocks; animation-duration: var(--animationDuration); }`)
    }

    return dropCss.join('')
  }

  const start = () => {
    console.log('animation engine started')

    const style = document.createElement('style')
    style.innerText += `body {--animationDuration: ${animationDuration*2}ms;}`
    style.innerText += generateDropAnimations()
    document.head.append(style)
    
  }

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
      observer(movement, target)
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

  start()

  return {
    handleMovementAnimation,
    subscribe
  }
}