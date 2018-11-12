import React from 'react'
import { colors } from '../styles'
import styles from './Cell.module.css'

export default function (props) {
  const { data, mark, choose, target } = props
  return <div onClick={data.color ? undefined : target} style={{
    width: '40px', height: '40px', display: 'flex',
    alignItems: 'center', 'justifyContent': 'center', backgroundColor: colors.grey
  }}>
    {
      data.future &&
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: data.future.color }}></div>
    }
    {
      data.color &&
      <div onClick={choose} className={(mark ? styles['mark'] : '') + ' ' + (data.remove ? styles['disappear'] : '')}
        style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: data.color, position: 'relative' }}></div>
    }
  </div>
}