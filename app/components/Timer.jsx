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
    let level = this.props.level
    if (level <= 2) {
      return 6
    } else {
      return 5
    }
  }

  pauseTimer() {
    clearInterval(this.time)
  }

  startTimer() {
    this.time = setInterval(this.tick, 1000)
    this.currCommand = this.props.currentPlayer.currentCommand
  }

  tick() {
    let defaultTime = this.timeForLevel()
    // Timer reached 0 (command expired)

    if (this.state.startTime <= 0){
      this.props.commandExpired(this.props.currentPlayer.uid)
      this.setState({startTime: defaultTime})
    }

    // Player did correct command
    else if (this.props.currentPlayer.currentCommand && this.props.currentPlayer.currentCommand !== this.currCommand) {
      // when the command changes, reset the timer, then reset the local "currCommand"
      this.currCommand = this.props.currentPlayer.currentCommand
      this.setState({startTime: defaultTime})
    }

    // The ticking:
    this.setState({startTime: this.state.startTime - 1})

    // Game Over (successfully added all ingredients)
    if (!this.props.currentPlayer.currentCommand) {
      clearInterval(this.time)
    }
  }

  render() {
    const time = this.state.startTime
    const totalTime = this.timeForLevel()
    let percent = Math.ceil(((time)/(totalTime -1)) * 100)
    if(percent > 100){percent = 100}
    return (
      <div>
        <Progress
          percent={percent}
          theme={{
            success: {
              symbol: '🔮',
              color: '#B920D3'
            },
            active: {
              symbol: '🔮',
              color: '#730187'
            },
            default: {
              symbol: '😱',
              color: '#32003A'
            }
          }}
        />
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win}) => ({gameStarted, players, ingredients, commands, score, level, win}),
  {commandExpired},
)(Timer)
