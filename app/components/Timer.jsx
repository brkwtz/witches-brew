import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import {commandExpired} from './reducers'

export class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 7000, // timer start in milliseconds
      currentUserId: this.props.currentPlayer.uid,
      cycle: 0
    }
    this.tick = this.tick.bind(this)
    this.stopTime = Date.now() + this.state.time
  }

  componentDidMount() {
    this.time = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.time)
  }

  tick() {

    let currentPlayer = this.props.currentPlayer
    let now = Date.now()
    if (this.state.cycle === 4) {
      clearInterval(this.time)
    } else if (this.stopTime - now <= 0) {
      this.setState({time: 0})
      clearInterval(this.time)
      // console.log('is the local state updating?', this.state.cycle)
      this.props.commandExpired(currentPlayer.uid)
      console.log('current player, cycle is updating in timer component:', currentPlayer.timerCycle)
      this.setState({
        time: 7000,
      })
      this.stopTime = Date.now() + this.state.time
      this.time = setInterval(this.tick, 1000)
    } else {
      this.setState({
        time: this.stopTime - now,
        cycle: this.props.players[this.state.currentUserId].timerCycle // this.state.cycle + 1
      })
    }
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
