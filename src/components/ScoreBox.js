import React from 'react'
import {colors} from '../styles'

export default function(props) {
  return <div style={{width: '100%', backgroundColor: colors.grey, padding: '5px'}}>
    Score: {props.score}
  </div>
}