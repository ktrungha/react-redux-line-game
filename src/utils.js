import { colors, lineSize } from './Constants'
import PriorityQueue from 'js-priority-queue'

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function addNewBall(content) {
  let count = 0
  const total = content.length * content[0].length
  for (let row = 0; row < content.length; row++) {
    for (let col = 0; col < content[0].length; col++) {
      const cell = content[row][col]
      if (cell.future || cell.color) {
        count++;
      }
    }
  }

  if (count === total) {
    return null
  }

  while (true) {
    for (let row = 0; row < content.length; row++) {
      for (let col = 0; col < content[0].length; col++) {
        const cell = content[row][col]
        if (!cell.future && !cell.color) {
          if (Math.random() < 1 / (total - count)) {
            return { x: col, y: row, color: colors[getRandomInt(colors.length)] }
          }
        }
      }
    }
  }
}

export function cloneContent(content) {
  const newContent = content.map(row => row.map(cell => ({ ...cell })))
  return newContent
}

export function findPath(fromX, fromY, toX, toY, content) {
  const startNode = fromX + '-' + fromY
  const toNode = toX + '-' + toY
  let distances = {};
  const visited = {}

  // Stores the reference to previous nodes
  let prev = {};
  let pq = new PriorityQueue({ comparator: function (a, b) { return a.d - b.d } });

  // Set distances to all nodes to be infinite except startNode
  distances[startNode] = 0;
  pq.queue({ node: startNode, d: 0 });
  content.forEach((row, rindex) => {
    row.forEach((cell, cindex) => {
      if (rindex !== fromY || cindex !== fromX) {
        distances[cindex + '-' + rindex] = Infinity
      }
    })
  })

  while (pq.length > 0) {
    let item = pq.dequeue();
    let currNode = item.node;
    if (visited[currNode]) {
      continue
    }
    visited[currNode] = true
    if (currNode === toNode) {
      break
    }

    getNeighbor(currNode, content).forEach(neighbor => {
      if (visited[neighbor] === undefined) {
        const alt = distances[currNode] + 1
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          prev[neighbor] = currNode
          pq.queue({ node: neighbor, d: alt })
        }
      }
    })
  }

  if (visited[toNode] === undefined) {
    return undefined
  }
  let prevNode = prev[toNode]
  const tmpPath = []
  if (toNode === startNode) {
    return tmpPath
  }
  tmpPath.push(toNode)
  while (prevNode !== startNode) {
    tmpPath.push(prevNode)
    prevNode = prev[prevNode]
  }

  return tmpPath.reverse()
}

function getNeighbor(node, content) {
  const splits = node.split('-')
  const x = parseInt(splits[0], 10)
  const y = parseInt(splits[1], 10)

  const retval = []

  if (x > 0) {
    const neighbor = content[y][x - 1]
    if (neighbor.color === undefined || neighbor.future) {
      retval.push((x - 1) + '-' + y)
    }
  }
  if (y > 0) {
    const neighbor = content[y - 1][x]
    if (neighbor.color === undefined || neighbor.future) {
      retval.push(x + '-' + (y - 1))
    }
  }
  if (x < content[0].length - 1) {
    const neighbor = content[y][x + 1]
    if (neighbor.color === undefined || neighbor.future) {
      retval.push((x + 1) + '-' + y)
    }
  }
  if (y < content.length - 1) {
    const neighbor = content[y + 1][x]
    if (neighbor.color === undefined || neighbor.future) {
      retval.push(x + '-' + (y + 1))
    }
  }

  return retval
}

export function scanForLines(x, y, content) {
  const retval = []

  const color = content[y][x].color
  // vertical
  let top = y
  for(let i = y - 1; i >= 0; i++) {
    if (content[i][x].color === color) {
      top = i
    } else {
      break
    }
  }
  let bottom = y
  for(let i = y + 1; i < content.length; i++) {
    if (content[i][x].color === color) {
      bottom = i
    } else {
      break
    }
  }
  if(bottom - top + 1 >= lineSize) {
    retval.push({start: {x, y: top}, end: {x, y: bottom}})
  }

  // horizontal
  let left = x
  for(let i = x - 1; i >= 0; i++) {
    if (content[y][i].color === color) {
      left = i
    } else {
      break
    }
  }
  let right = x
  for(let i = x + 1; i < content[0].length; i++) {
    if (content[y][i].color === color) {
      right = i
    } else {
      break
    }
  }
  if(right - left + 1 >= lineSize) {
    retval.push({start: {y, x: left}, end: {y, x: right}})
  }
}