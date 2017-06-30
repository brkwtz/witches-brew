import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'

import {commandExpired} from './reducers'

export class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.timeForLevel = this.timeForLevel.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.pauseTimer = this.pauseTimer.bind(this)
    this.state = {
      startTime: this.timeForLevel()
    }
    this.tick = this.tick.bind(this)
  }

  componentDidMount() {
    this.startTimer()
  }

  componentWillUnmount() {
    this.pauseTimer()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.win === false) {
      this.pauseTimer()
    }
  }

  timeForLevel() {
    const level = this.props.level
    if (level <= 3) {
      return 8
    } else {
      return 7
    }
  }

  pauseTimer() {
    clearInterval(this.time)
  }

  startTimer() {
    const now = window.performance.now()
    this.setState({
      currentTime: now
    })
    this.running = true
    this.startTime = now
    this.endTime = now + (this.timeForLevel() * 1000)
    this.tick(now)
    this.currCommand = this.props.currentPlayer.currentCommand
  }

  tick = (currentTime) => {
    const defaultTime = this.timeForLevel()
    // Timer reached 0 (command expired)
    if (this.running) {
      window.requestAnimationFrame(this.tick)
    }
    this.setState({currentTime})
    if (currentTime > this.endTime) {
      this.props.commandExpired(this.props.currentPlayer.uid)
      this.startTimer()
    }

    // Player did correct command
    else if (this.props.currentPlayer.currentCommand && this.props.currentPlayer.currentCommand !== this.currCommand) {
      // when the command changes, reset the timer, then reset the local "currCommand"
      this.currCommand = this.props.currentPlayer.currentCommand
      this.startTimer()
    }

    // Game Over (successfully added all ingredients)
    if (!this.props.currentPlayer.currentCommand) {
      this.running = false
    }
  }

  render() {
    const time = this.endTime - this.state.currentTime
    const totalTime = this.endTime - this.startTime
    let percent = time / totalTime * 100
    return (
      <div style={{height: '10px', width: `${percent}%`, backgroundColor: '#B920D3', borderRadius: '5px'}} />
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win}) => ({gameStarted, players, ingredients, commands, score, level, win}),
  {commandExpired},
)(Timer)
