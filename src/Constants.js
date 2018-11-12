export const colors = [
  '#f44336',
  '#2196f3',
  '#4caf50',
  '#ffeb3b',
  '#9c27b0',
  '#795548',
  '#00bcd4'
]

export const width = 9
export const height = 9

export const addAmount = 3
export const lineSize = 5

export const emptyContent = []
for(let i = 0; i < height; i++) {
  const row = []
  for(let j = 0; j < width; j++) {
    row.push({})
  }
  emptyContent.push(row)
}