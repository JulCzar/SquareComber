import { createGameTable } from './src/js/game.js'
import { startTouchSupport } from './src/js/touch.js'
import { renderGame } from './src/js/view.js'

const gameConfig = {
  width: 10,
  height: 10,
  animationDuration: 0,
  renderInterface: '#app',
  animatedInterface: '.gem'
}

const game = createGameTable(gameConfig)
game.subscribe(renderGame)
game.start()

const touchHandler = startTouchSupport('#app')
touchHandler.subscribe(game.handleMovement)