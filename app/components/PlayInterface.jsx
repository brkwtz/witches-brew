import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import Cauldron from './Cauldron'
import Command from './Command'
import Ingredients from './Ingredients'
import lodash from 'lodash'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, startGame, addIngredient, commandExpired, updateScore, stageOver} from './reducers'

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

  clickToStart = () => {
    let commands = []
    let ingredients = []
    let playerNum = Object.keys(this.props.players).length

    lodash.shuffle(Object.keys(ingredientsCommands)).slice(0, playerNum*4).forEach(ingredient => {
      ingredients.push(ingredient)
      commands.push(ingredientsCommands[ingredient])
    })

    this.props.startGame(true, commands, ingredients)
  }

  render() {
    console.log('>>>>>players', this.props.players)
    if (!this.state.user) return null
    const currentPlayer = this.props.players[this.state.user.uid]

    console.log('>>>>>current players', currentPlayer)

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
  {playerJoin, startGame, addIngredient, commandExpired, updateScore, stageOver},
)(PlayInterface)
