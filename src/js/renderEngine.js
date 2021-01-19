import MovementInfo from './models/movement.js'

export const createRenderEngine = ({
  renderInterface,
  height = 4,
  gridSize,
  animationDuration = 250,
  animatedInterface
}) => {
  if (!animatedInterface) throw new Error('target interface of animation engine not declared')
  const app = document.querySelector(renderInterface)
  const observers = []

  const generateFallingAnimations = () => {
    const dropCss = []

    for (let i=height; i>0; i--) {
      dropCss.push(`@keyframes falling-${i}-blocks { 0% { transform: translateY(-${i*gridSize}) }; 100% {} }`)
      dropCss.push(` .fall-${i}-blocks { animation: falling-${i}-blocks; animation-duration: var(--animationDuration); }`)
    }

    return dropCss.join('')
  }

  const start = () => {
    console.log('animation engine started')

    const style = document.createElement('style')
    style.innerText += `body {--animationDuration: ${animationDuration*2}ms;}`
    style.innerText += generateFallingAnimations()
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

    observers.forEach(observer => observer({movement, target}))
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
  const triggerSwapAnimation = ({movement, target}) => {
    notifyAll(movement, target)

    fireAnimation(target, movement)

    setTimeout(() => removeAnimation(target, movement), animationDuration*2)
  }
  
  /**
   * @param {number[][]} gameGrid 
   */
  const render = (gameGrid, changes) => {
    console.log('grid changes', changes)
    const emojis = ['fa-grin-tongue', 'fa-grin-hearts', 'fa-grin-stars', 'fa-grin-beam-sweat', 'fa-flushed']

    app.innerHTML = gameGrid.reduce((acc, item, i) => {
      acc += '<div class="row">'

    acc += item.map((value, j) => `<div draggable="false" row="${i}" col="${j}" class="gem far ${emojis[value] || ''}"></div>`).join('')

      return acc + '</div>'
    }, '<div class="table">') + '</div>'
  }

  start()

  return {
    render,
    triggerSwapAnimation,
    subscribe
  }
}