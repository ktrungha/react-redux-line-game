import React, { Component } from 'react';
import { connect } from 'react-redux'
import ScoreBox from './components/ScoreBox'
import Board from './components/Board'
import {emptyContent, addAmount} from './Constants'
import {addNewBall, cloneContent} from './utils'
import {newGame, choose, target} from './reducer'
import {colors} from './styles'

class App extends Component {
  constructor(props) {
    super(props)

    this.newGame = this.newGame.bind(this)
    this.choose = this.choose.bind(this)
    this.target = this.target.bind(this)
  }

  newGame() {
    const newContent = cloneContent(emptyContent)

    for(let i = 0; i < addAmount; i++) {
      const {x, y, color} = addNewBall(newContent)
      newContent[y][x].color = color
    }

    for(let i = 0; i < addAmount; i++) {
      const {x, y, color} = addNewBall(newContent)
      newContent[y][x].future = {color}
    }

    this.props.dispatch(newGame(newContent, addAmount))
  }

  choose(x, y) {
    this.props.dispatch(choose(x, y))
  }

  target(fromX, fromY, toX, toY, content) {
    this.props.dispatch(target(fromX, fromY, toX, toY, content))
  }

  render() {
    const { score, content, chosen } = this.props;

    return (
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ padding: '30px', borderRadius: '10px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button style={{ padding: '5px', borderRadius: '5px', fontSize: '17px' }} onClick={this.newGame}>New game</button>
          <div style={{ height: '10px' }} > </div>
          <ScoreBox score={score} />
        </div>
        <div style={{boxShadow: `0 0 5px 2px ${colors.grey}` }}>
        <Board content={content} choose={this.choose} target={this.target} chosen={chosen} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    score: state.score || 0,
    content: state.content || emptyContent,
    chosen: {x: state.chosenX, y: state.chosenY}
  }
}

export default connect(mapStateToProps)(App);
