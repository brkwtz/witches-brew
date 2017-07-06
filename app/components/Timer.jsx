import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import {commandExpired, startRound} from './reducers'

export class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.timeForLevel = this.timeForLevel.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.state = {
      startTime: this.timeForLevel()
    }
    this.tick = this.tick.bind(this)
  }

  componentDidMount() {
    console.log('timer start: component did mount')
    this.startTimer()
  }

  componentWillUnmount() {
    console.log('timer stop: component will unmount')
    this.stopTimer()
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps.win !== null) {
  //     console.log('winning')
  //     this.stopTimer()
  //   }
  // }

  timeForLevel() {
    const level = this.props.level
    if (level <= 3) {
      return 8 + Math.random() * Math.random() * Math.random()
    } else {
      return 7 + Math.random() * Math.random() * Math.random()
    }
  }

  timer = () => window.requestAnimationFrame(this.tick)

  stopTimer() {
    this.running = false
    window.cancelAnimationFrame(this.timer)
  }

  startTimer() {
    const now = window.performance.now()
    this.setState({
      currentTime: now
    })
    this.running = true
    this.startTime = now
    this.endTime = now + (this.timeForLevel() * 1000)
    this.currCommand = this.props.currentPlayer.currentCommand
    this.tick(now)
  }

  tick = (currentTime) => {
    const defaultTime = this.timeForLevel()
    // start the ticking!
    if (this.running) {
      this.timer()

      // update time [for ticking]
      this.setState({currentTime})
    }

    // if currentTime reaches endTime and is running
    if (currentTime > this.endTime && this.running) {
      console.log('timer stop: command expired')
      this.stopTimer() // stop the original timer
      console.log('timer start: post-command expired')
      this.props.commandExpired(this.props.currentPlayer.uid)
      if (this.props.win === null) { // start a new timer
        console.log('timer start: no win')
        this.startTimer()
      }
    }

    // Player did correct command, and there are more commands to do
    else if (this.props.currentPlayer.currentCommand && this.props.currentPlayer.currentCommand !== this.currCommand) {
      // when the command changes, reset the local "currCommand", reset the timer
      this.currCommand = this.props.currentPlayer.currentCommand
      console.log('timer stop: add ingredient')
      this.stopTimer() // stop the timer
      // if the game has not ended, restart timer
      if (this.props.win === null) {
        console.log('timer start: add ingredient')
        this.startTimer()
      }
    }

    // else if (!this.props.currentPlayer.currentCommand || this.props.ultimateWin) {
    else if (this.props.ultimateWin) {
      console.log('timer stop: current command over or ultimate win')
      this.stopTimer()
    }

    // if (this.props.currentPlayer.waiting) {
    //   this.stopTimer()
    // }
  }

  render() {
    const time = this.endTime - this.state.currentTime
    const totalTime = this.endTime - this.startTime
    let percent = time / totalTime * 100
    return (
      <div>
      <div id="overlay"></div>
      <div id="timerBg">
        <div id="bar" style={{width: `${percent}%`}} />
      </div>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, ultimateWin}) => ({gameStarted, players, ingredients, commands, score, level, win, ultimateWin}),
  {commandExpired, startRound},
)(Timer)
