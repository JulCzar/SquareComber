/**
 * 
 * @param {string} touchableInterfaceSelector the selector for the touch event listener
 */
export const startTouchSupport = (touchableInterfaceSelector) => {
  const touchableInterface = document.querySelector(touchableInterfaceSelector)
  const state = {
    initialX: null,
    initialY: null
  }
  
  /**
   * @param {MouseEvent} e 
   */
  const startMouseSwipe = e => {
    state.initialX = e.clientX
    state.initialY = e.clientY
  }

  /**
   * @param {TouchEvent} e 
   */
  const startTouchSwipe = e => {
    const [firstTouch] = e.touches

    state.initialX = firstTouch.clientX
    state.initialY = firstTouch.clientY
  }
  
  /**
   * @param {MouseEvent} e 
   */
  const movingMouseSwipe = e => {
    if (!state.initialX) return
    if (!state.initialY) return

    const currentX = e.clientX;
    const currentY = e.clientY;

    const diffX = state.initialX - currentX;
    const diffY = state.initialY - currentY;

    movingSwipe(diffX, diffY, e.target)

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

    const diffX = state.initialX - currentX;
    const diffY = state.initialY - currentY;

    movingSwipe(diffX, diffY, e.target)

    e.preventDefault();
  }

  /**
   * @param {number} diffX 
   * @param {number} diffY 
   * @param {HTMLElement} target 
   */
  const movingSwipe = (diffX, diffY, target) => {
    if (Math.abs(diffX) < 40 && Math.abs(diffY) < 40) return

    const { row, col } = target.attributes

    console.log(`item row: ${row.value}, col: ${col.value}`)
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        console.log('swiped left');
      } else {
        // swiped right
        console.log('swiped right');
      }  
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        console.log('swiped up');
      } else {
        // swiped down
        console.log('swiped down');
      }  
    }

    state.initialX = null;
    state.initialY = null;
  }

  const endSwipe = () => {
    state.initialX = null
    state.initialY = null
  }

  touchableInterface.addEventListener('touchstart', startTouchSwipe, false)
  touchableInterface.addEventListener('mousedown', startMouseSwipe, false)
  touchableInterface.addEventListener('touchmove', movingTouchSwipe, false)
  touchableInterface.addEventListener('mousemove', movingMouseSwipe, false)
  touchableInterface.addEventListener('touchup', endSwipe, false)
  touchableInterface.addEventListener('mouseup', endSwipe, false)
}