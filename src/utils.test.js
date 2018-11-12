import {findPath} from './utils'

describe('Find path', () => {
  it('Simple', () => {
    const color = ''
    const content = [
      [{}, {color}, {}],
      [{}, {color}, {}],
      [{}, {}, {color, future: true}],
    ]
    const path = findPath(0, 0, 2, 2, content)
    expect(path[0]).toBe('0-1')
    expect(path[1]).toBe('0-2')
    expect(path[2]).toBe('1-2')
    expect(path[3]).toBe('2-2')
  })
  it('Unreachable', () => {
    const color = ''
    const content = [
      [{}, {color}, {}],
      [{}, {color}, {}],
      [{}, {color}, {}],
    ]
    const path = findPath(0, 0, 2, 2, content)
    expect(path).toBe(undefined)
  })
  it('U turn', () => {
    const color = ''
    const content = [
      [{}, {color}, {}, {}],
      [{}, {color}, {}, {color}],
      [{}, {}, {}, {color}],
    ]
    const path = findPath(0, 0, 3, 0, content)
    expect(path[0]).toBe('0-1')
    expect(path[1]).toBe('0-2')
    expect(path[2]).toBe('1-2')
    expect(path[3]).toBe('2-2')
    expect(path[4]).toBe('2-1')
    expect(path[5]).toBe('2-0')
    expect(path[6]).toBe('3-0')
  })
  it('Stay', () => {
    const color = ''
    const content = [
      [{}, {color}, {}],
      [{}, {color}, {}],
      [{}, {}, {color, future: true}],
    ]
    const path = findPath(0, 0, 0, 0, content)
  })
})