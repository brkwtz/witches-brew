import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import Cauldron from './Cauldron'
import Command from './Command'
import Ingredients from './Ingredients'
import lodash from 'lodash'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, playerReady, startRound, addIngredient, commandExpired} from './reducers'

export class PlayInterface extends React.Component {
  state = {user: null}

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user})
      if (!user) return
      if (!this.props.players[user.uid]) {
        let player = {uid: user.uid, ingredients: [], currentCommand: ''}
        this.props.playerJoin(player)
      }
    })
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.user) return
    if (newProps.players[this.state.user.uid].master && lodash.every(newProps.players, player => player.ready) && !newProps.gameStarted) {
      this.props.startRound()
    }
  }

  clickToStart = () => {
    this.props.playerReady(this.state.user.uid)
  }

    //redirect to game over page


  render() {
    if (!this.state.user) return null
    const currentPlayer = this.props.players[this.state.user.uid]
    return (
      <div>
        <h3>Welcome to the coven of {this.props.params.title}!</h3>
        <Cauldron />
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
  ({gameStarted, players, ingredients, commands, score, level}) => ({gameStarted, players, ingredients, commands, score, level}),
  {playerJoin, playerReady, startRound, addIngredient, commandExpired},
)(PlayInterface)
