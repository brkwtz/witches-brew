import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import {commandExpired} from './reducers'

export class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 7000, // timer start in milliseconds
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
    let now = Date.now()
    if (this.state.cycle === 4) {
      clearInterval(this.time)
    } else if (this.stopTime - now <= 0) {
      console.log('PROOOOPS', this.props)
      this.setState({time: 0})
      clearInterval(this.time)

      this.props.commandExpired(this.props.currentPlayer.uid)
      this.setState({
        time: 7000,
        cycle: this.state.cycle + 1
      })
      this.stopTime = Date.now() + this.state.time
      this.time = setInterval(this.tick, 1000)
    } else {
      this.setState({
        time: this.stopTime - now
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
