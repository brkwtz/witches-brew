import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import {commandExpired} from './reducers'

export class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.tick = this.tick.bind(this)
    this.stopTime = Date.now() + this.state.time
  }

  componentDidMount() {
    //this.time = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.time)
  }

  tick() {
    let now = Date.Now()
  }

  render() {
    const time = this.state.time / 1000
    return (
      <div>
      <span style={{color: 'red'}}>{Math.ceil(time)}</span>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  {commandExpired},
)(Timer)
