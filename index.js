import { getAnimationEngine } from './src/js/animate.js'
import { createGameTable } from './src/js/game.js'
import { startTouchSupport } from './src/js/touch.js'
import { renderGame } from './src/js/view.js'

const game = createGameTable(10, 10)
game.subscribe(renderGame)
game.start()

const animationEngine = getAnimationEngine(500)
const touchHandler = startTouchSupport('#app')

animationEngine.subscribe(game.handleMovement)
touchHandler.subscribe(animationEngine.handleMovementAnimation)