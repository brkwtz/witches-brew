import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

import {commandExpired} from './reducers'

export class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startTime: 30
    }
    this.tick = this.tick.bind(this)
  }

  componentDidMount() {
    this.time = setInterval(this.tick, 1000)
    this.currCommand = this.props.currentPlayer.currentCommand
  }

  componentWillUnmount() {
    clearInterval(this.time)
  }

  tick() {
    // Timer reached 0 (command expired)
    if(this.state.startTime <= 0){
      this.props.commandExpired(this.props.currentPlayer.uid)
      this.setState({startTime: 30})
    }

    // Player did correct command 
    else if(this.props.currentPlayer.currentCommand && this.props.currentPlayer.currentCommand !== this.currCommand){
      // when the command changes, reset the timer, then reset the local "currCommand"
      this.currCommand = this.props.currentPlayer.currentCommand
      this.setState({startTime: 30})
    }

    // The ticking:
    this.setState({startTime: this.state.startTime - 1})

    // Game Over (successfully added all ingredients)
    if(!this.props.currentPlayer.currentCommand){
      clearInterval(this.time)
     }
  }

  render() {
    const time = this.state.startTime
    const percent = Math.floor((time/30) * 100)
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
      <span style={{color: 'red'}}><h1>{time}</h1></span>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  {commandExpired},
)(Timer)


//