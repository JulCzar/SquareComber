/**
 * function that renders the game view based on the current grid layout
 * @param {[number][]} gameGrid 
 */
export const renderGame = gameGrid => {
  const app = document.getElementById('app')
  const emojis = ['fa-grin-tongue', 'fa-grin-hearts', 'fa-grin-stars', 'fa-grin-beam-sweat', 'fa-flushed']

  app.innerHTML = gameGrid.reduce((acc, item, i) => {
    acc += '<div class="row">'

    acc += item.map((value, j) => `<div draggable="false" row="${i}" col="${j}" class="gem fas fa-2x ${emojis[value]}"></div>`).join('')

    return acc + '</div>'
  }, '<div class="table">') + '</div>'
}