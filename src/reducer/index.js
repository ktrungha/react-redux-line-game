import { cloneContent } from '../utils'
import { lineSize } from '../Constants';

const NEW_GAME = 'newGame'
export const CHOOSE = 'choose'
export const UNCHOOSE = 'unchoose'
export const TARGET = 'target'
export const MOVE = 'move'
export const RELOCATE_FUTURE = 'relocateFuture'
export const NEXT = 'next'
export const ADD_FUTURE = 'addFuture'
export const MARK_REMOVE_BALLS = 'markRemoveBalls'
export const REMOVE_BALLS = 'removeBalls'

export function newGame(content, count) {
  return {
    type: NEW_GAME,
    content,
    count
  }
}

export function choose(x, y) {
  return {
    type: CHOOSE,
    x, y
  }
}

export function target(fromX, fromY, toX, toY, content) {
  return {
    type: TARGET,
    fromX, fromY, toX, toY, content
  }
}

export function relocateFuture(fromX, fromY, x, y) {
  return {
    type: RELOCATE_FUTURE,
    fromX, fromY, x, y
  }
}

export function addFuture(futures) {
  return {
    type: ADD_FUTURE,
    futures
  }
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case NEW_GAME:
      return { content: action.content, count: action.count, score: 0 }
    case CHOOSE:
      return { ...state, chosenX: action.x, chosenY: action.y }
    case UNCHOOSE:
      return { ...state, chosenX: undefined, chosenY: undefined }
    case MOVE: {
      const content = cloneContent(state.content)
      content[action.toY][action.toX].color = content[action.fromY][action.fromX].color
      content[action.fromY][action.fromX].color = undefined
      return {
        ...state,
        content
      }
    }
    case RELOCATE_FUTURE: {
      if (state.content[action.y][action.x].future) {
        const content = cloneContent(state.content)
        content[action.fromY][action.fromX].future = content[action.y][action.x].future
        content[action.y][action.x].future = undefined
        return {
          ...state,
          content
        }
      }
      return state
    }
    case NEXT: {
      let count = state.count
      const content = cloneContent(state.content)
      for (let i = 0; i < content.length; i++) {
        for (let j = 0; j < content[0].length; j++) {
          const cell = content[i][j]
          if (cell.future) {
            cell.color = cell.future.color
            cell.future = undefined
            count++
          }
        }
      }
      return {
        ...state,
        count, content
      }
    }
    case ADD_FUTURE: {
      const content = cloneContent(state.content)
      for (let i = 0; i < action.futures.length; i++) {
        const future = action.futures[i]
        content[future.y][future.x] = { future: { color: future.color } }
      }
      return {
        ...state,
        content
      }
    }
    case MARK_REMOVE_BALLS: {
      const content = state.content
      const newContent = cloneContent(state.content)
      let count = state.count
      let score = state.score

      // horizontal
      for (let i = 0; i < content.length; i++) {
        let length = 1
        for (let j = 1; j < content[0].length; j++) {
          if (content[i][j].color && content[i][j].color === content[i][j - 1].color) {
            length++

            if (length >= lineSize) {
              if (j + 1 === content[0].length || content[i][j + 1].color !== content[i][j].color) {
                for (let k = 0; k < length; k++) {
                  newContent[i][j - k].remove = true
                  count--
                  score++
                }
              }
            }
          } else {
            length = 1
          }
        }
      }

      // vertical
      for (let i = 0; i < content[0].length; i++) {
        let length = 1
        for (let j = 1; j < content.length; j++) {
          if (content[j][i].color && content[j][i].color === content[j - 1][i].color) {
            length++

            if (length >= lineSize) {
              if (j + 1 === content.length || content[j + 1][i].color !== content[j][i].color) {
                for (let k = 0; k < length; k++) {
                  newContent[j - k][i].remove = true
                  count--
                  score++
                }
              }
            }
          } else {
            length = 1
          }
        }
      }

      // down diagonal
      let startPoints = []
      for (let i = 0; i < content.length; i++) {
        startPoints.push({ x: 0, y: i })
      }
      for (let i = 1; i < content[0].length; i++) {
        startPoints.push({ x: i, y: 0 })
      }
      for (let i = 0; i < startPoints.length; i++) {
        const point = startPoints[i]
        let length = 1
        for (let j = 1; point.x + j < content[0].length && point.y + j < content.length; j++) {
          if (content[point.y + j][point.x + j].color &&
            content[point.y + j][point.x + j].color === content[point.y + j - 1][point.x + j - 1].color) {
            length++

            if (length >= lineSize) {
              if (point.x + j + 1 === content[0].length || point.y + j + 1 === content.length ||
                content[point.y + j][point.x + j].color !== content[point.y + j + 1][point.x + j + 1].color) {
                for (let k = 0; k < length; k++) {
                  newContent[point.y + j - k][point.x + j - k].remove = true
                  count--
                  score++
                }
              }
            }
          } else {
            length = 1
          }
        }
      }

      // up diagonal
      startPoints = []
      for(let i = 0; i < content.length; i++) {
        startPoints.push({x: 0, y: i})
      }
      for (let i = 1; i < content[0].length; i++) {
        startPoints.push({ x: i, y: content[0].length - 1 })
      }
      for (let i = 0; i < startPoints.length; i++) {
        const point = startPoints[i]
        let length = 1
        for (let j = 1; point.x + j < content[0].length && point.y - j >= 0; j++) {
          if (content[point.y - j][point.x + j].color &&
            content[point.y - j][point.x + j].color === content[point.y - j + 1][point.x + j - 1].color) {
            length++

            if (length >= lineSize) {
              if (point.x + j + 1 === content[0].length || point.y - j === 0 ||
                content[point.y - j][point.x + j].color !== content[point.y - j - 1][point.x + j + 1].color) {
                for (let k = 0; k < length; k++) {
                  newContent[point.y - j + k][point.x + j - k].remove = true
                  count--
                  score++
                }
              }
            }
          } else {
            length = 1
          }
        }
      }

      return {
        ...state,
        content: newContent,
        count,
        score
      }
    }
    case REMOVE_BALLS: {
      const newContent = cloneContent(state.content)
      newContent.forEach(row => {
        row.forEach(cell => {
          if (cell.remove) {
            cell.color = undefined
            cell.remove = undefined
          }
        })
      })
      return {
        ...state,
        content: newContent
      }
    }
    default:
      return state;
  }
}