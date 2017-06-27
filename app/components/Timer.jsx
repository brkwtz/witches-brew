import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import {commandExpired} from './reducers'

export class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timerPosition: 0,
      isTicking: false
    }
  }

  render() {
    return (
      <div>
      <h1>{this.state.timerPosition}</h1>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  {commandExpired},
)(Timer)
