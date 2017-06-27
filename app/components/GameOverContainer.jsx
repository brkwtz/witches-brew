import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import lodash from 'lodash'
import {browserHistory} from 'react-router'

import {playerJoin, playerReady, startRound, addIngredient, commandExpired} from './reducers'

    //on game over page, replay button
      //on replay, reset game state
    //on game over page, show score and animation
    //on firebase disconnect, delete the room

export class GameOverContainer extends React.Component {

  clickToRestart = () => {
    this.props.startRound()
    browserHistory.push(`/play/${this.props.params.title}/`)
  }

  render() {
    // if (!this.state.user) return null
    // const currentPlayer = this.props.players[this.state.user.uid]
    return (
      <div>
        <p>HELLO</p>
        <button onClick={this.clickToRestart}>Play Again</button>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level}) => ({gameStarted, players, ingredients, commands, score, level}),
  {playerJoin, playerReady, startRound, addIngredient, commandExpired},
)(GameOverContainer)
