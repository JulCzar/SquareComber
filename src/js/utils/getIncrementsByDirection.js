/**
 * 
 * @param {'up' | 'down' | 'left' | 'right'} direction 
 */
export const getIncrements = (direction) => ({
  'up': {
    xIncrement: 0,
    yIncrement: -1
  },
  'right': {
    xIncrement: 1,
    yIncrement: 0
  },
  'down': {
    xIncrement: 0,
    yIncrement: 1
  },
  'left': {
    xIncrement: -1,
    yIncrement: 0
  }
}[direction])