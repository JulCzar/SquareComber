import { createGameTable } from './src/js/games.js'
import { startTouchSupport } from './src/js/touch.js'
import { renderGame } from './src/js/view.js'

const game = createGameTable(10, 10)

game.subscribe(renderGame)

game.start()
startTouchSupport('.table')