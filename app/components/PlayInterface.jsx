import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import Cauldron from './Cauldron'
import Command from './Command'
import Ingredients from './Ingredients'
import _ from 'lodash'
import {browserHistory} from 'react-router'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, playerReady} from './reducers/players'
import {startRound} from './reducers/levels'

export class PlayInterface extends React.Component {
  state = {user: null}

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user})
      if (!user) return
      if (!this.props.players[user.uid]) {
        const player = {uid: user.uid, ingredients: [], currentCommand: ''}
        this.props.playerJoin(player)
      }
    })
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.user) return
    if (newProps.players[this.state.user.uid] && newProps.players[this.state.user.uid].master && _.every(newProps.players, player => player.ready) && !newProps.gameStarted) {
      this.props.startRound()
    }
    if (newProps.win === false) {
      browserHistory.push(`/play/${this.props.params.title}/gameover`)
    }
  }

  clickToStart = () => {
    this.props.playerReady(this.state.user.uid)
  }

  clickToRestart = () => {
    this.props.startRound()
    browserHistory.push(`/play/${this.props.params.title}/`)
  }


  render() {
    if (!this.state.user) return null
    const currentPlayer = this.props.players[this.state.user.uid]
    return (
      <div>
        <h3>Welcome to the coven of {this.props.params.title}!</h3>
        <Cauldron />
        <h1>LEVEL {this.props.level}</h1>
        {
          (currentPlayer && this.props.gameStarted)
            ? (
              <div>
                <Ingredients
                  IngredientsCommands={ingredientsCommands}
                  currentPlayer={currentPlayer}/>
              </div>
          )
            : (
            <button onClick={this.clickToStart}>Start</button>
          )
        }
    </div>
    )
  }
}

export default connect(
  ({gamePlay, players, levels}) => ({gameStarted: gamePlay.gameStarted, players: players.players, ingredients: levels.ingredients, commands: gamePlay.commands, score: levels.score, level: levels.level, win: levels.win, currentCommand: levels.currentCommand}),
  {playerJoin, playerReady, startRound}
)(PlayInterface)
