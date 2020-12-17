/**
 * @param {string} touchableInterfaceSelector the selector for the touch event listener
 */
export const startTouchSupport = (touchableInterfaceSelector) => {
  const touchableInterface = document.querySelector(touchableInterfaceSelector)
  const observers = []
  const state = {
    initialTarget: null,
    initialX: NaN,
    initialY: NaN
  }

  /**
   * @param {(movementInfos: state) => void} observer 
   */
  const subscribe = observer => {
    observers.push(observer)
  }

  const notifyAll = (movement, target) => {
    console.log(`notifying ${observers.length} observer about a touch event`)

    for (const observer of observers)
      observer({ movement, target })
  }
  
  /**
   * @param {MouseEvent} e 
   */
  const startMouseSwipe = e => {
    state.initialX = e.clientX
    state.initialY = e.clientY
    state.initialTarget = e.target
  }

  /**
   * @param {TouchEvent} e 
   */
  const startTouchSwipe = e => {
    const [firstTouch] = e.touches

    state.initialX = firstTouch.clientX
    state.initialY = firstTouch.clientY
    state.initialTarget = e.target
  }
  
  /**
   * @param {MouseEvent} e 
   */
  const movingMouseSwipe = e => {
    if (!state.initialX) return
    if (!state.initialY) return

    const currentX = e.clientX;
    const currentY = e.clientY;

    const diffX = currentX - state.initialX;
    const diffY = currentY - state.initialY;

    movingSwipe(diffX, diffY)

    e.preventDefault();
  }

  /**
   * @param {TouchEvent} e 
   */
  const movingTouchSwipe = e => {
    if (!state.initialX) return
    if (!state.initialY) return

    const [firstTouch] = e.touches
    const currentX = firstTouch.clientX;
    const currentY = firstTouch.clientY;

    const diffX = currentX - state.initialX;
    const diffY = currentY - state.initialY;

    movingSwipe(diffX, diffY)

    e.preventDefault();
  }

  /**
   * @param {number} diffX 
   * @param {number} diffY 
   * @param {HTMLElement} target 
   */
  const movingSwipe = (diffX, diffY) => {
    if (Math.abs(diffX) < 35 && Math.abs(diffY) < 35) return
    
    const movement = { x: null, y: null, direction: null }
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
      movement.y = 0

      if (diffX > 0) {
        movement.x = 1
        movement.direction = 'left'
      }
      else {
        movement.x = -1
        movement.direction = 'right'
      }
    } else {
      movement.x = 0

      if (diffY > 0) {
        movement.y = 1
        movement.direction = 'up'
      }
      else {
        movement.y = -1
        movement.direction = 'down'
      }
    }

    state.initialX = null;
    state.initialY = null;

    notifyAll(movement, state.initialTarget)
  }

  const endSwipe = () => {
    state.initialX = null
    state.initialY = null
    state.initialTarget = null;
  }

  touchableInterface.addEventListener('touchstart', startTouchSwipe, false)
  touchableInterface.addEventListener('mousedown', startMouseSwipe, false)
  touchableInterface.addEventListener('touchmove', movingTouchSwipe, false)
  touchableInterface.addEventListener('mousemove', movingMouseSwipe, false)
  touchableInterface.addEventListener('touchup', endSwipe, false)
  touchableInterface.addEventListener('mouseup', endSwipe, false)

  return {
    subscribe
  }
}