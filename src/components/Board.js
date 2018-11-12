import React from 'react'
import Cell from './Cell'

export default function (props) {
  const { content, choose, target, chosen } = props
  return <table style={{ margin: '15px' }}>
    <tbody>
      {
        content.map((row, rindex) => {
          return <tr key={rindex}>{
            row.map((cell, cindex) => {
              const mark = cindex === chosen.x && rindex === chosen.y
              return <td key={cindex}>
                <Cell data={cell}
                  target={() => target(chosen.x, chosen.y, cindex, rindex, content)}
                  choose={() => choose(cindex, rindex)} mark={mark} />
              </td>
            })
          }</tr>
        })
      }
    </tbody>
  </table>
}