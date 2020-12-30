import { getAnimationEngine } from './src/js/animate.js'
import { createGameTable } from './src/js/game.js'
import { startTouchSupport } from './src/js/touch.js'
import { createRenderEngine } from './src/js/view.js'

const gameConfig = {
  width: 10,
  height: 10,
  animationDuration: 200,
  renderInterface: '#app',
  animatedInterface: '.gem'
}

const game = createGameTable(gameConfig)
const renderEngine = createRenderEngine(gameConfig)
game.subscribe(renderEngine.render)
game.start()

const animationEngine = getAnimationEngine(gameConfig)
const touchHandler = startTouchSupport(gameConfig.renderInterface)

animationEngine.subscribe(game.handleMovement)
touchHandler.subscribe(animationEngine.handleMovementAnimation)