export const createRenderEngine = ({ renderInterface }) => {
  const app = document.querySelector(renderInterface)
  
  /**
   * @param {number[][]} gameGrid 
   */
  const render = gameGrid => {
    const emojis = ['fa-grin-tongue', 'fa-grin-hearts', 'fa-grin-stars', 'fa-grin-beam-sweat', 'fa-flushed']

    app.innerHTML = gameGrid.reduce((acc, item, i) => {
      acc += '<div class="row">'

      acc += item.map((value, j) => `<div draggable="false" row="${i}" col="${j}" class="gem far ${emojis[value] || ''}"></div>`).join('')

      return acc + '</div>'
    }, '<div class="table">') + '</div>'
  }

  return {
    render
  }
}