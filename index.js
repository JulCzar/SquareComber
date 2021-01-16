import { getAnimationEngine } from './src/js/animate.js'
import { createGameEnvironment } from './src/js/game.js'
import { startTouchSupport } from './src/js/touch.js'
import { createRenderEngine } from './src/js/view.js'

const gameConfig = {
  width: 10,
  height: 10,
  animationDuration: 200,
  renderInterface: '#app',
  animatedInterface: '.gem',
  touchInterface: "#app"
}

const game = createGameEnvironment(gameConfig)
const renderEngine = createRenderEngine(gameConfig)
const animationEngine = getAnimationEngine(gameConfig)
const touchHandler = startTouchSupport(gameConfig.touchInterface)

game.subscribe(renderEngine.render)
game.start()

animationEngine.subscribe(game.handleMovement)
touchHandler.subscribe(animationEngine.handleMovementAnimation)