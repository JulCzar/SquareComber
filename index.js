import { createGameEnvironment } from './src/js/game.js'
import { startTouchSupport } from './src/js/touch.js'
import { createRenderEngine } from './src/js/renderEngine.js'

const gameConfig = {
  width: 10,
  height: 10,
  gridSize: 60,
  animationDuration: 500,
  renderInterface: '#app',
  animatedInterface: '.gem',
  touchInterface: "#app"
}

const game = createGameEnvironment(gameConfig)
const view = createRenderEngine(gameConfig)
const touchHandler = startTouchSupport(gameConfig.touchInterface)

game.subscribe(view.render)
game.start()

view.subscribe(game.handleMovement)
touchHandler.subscribe(view.triggerSwapAnimation)