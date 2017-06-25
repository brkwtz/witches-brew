import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import Cauldron from './Cauldron'
import Command from './Command'
import Ingredients from './Ingredients'
import lodash from 'lodash'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, startGame, addRightIngredient, commandExpired, updateScore, stageOver} from './reducers'

export class PlayInterface extends React.Component {
  constructor(props) {
    super(props)
    this.clickToStart = this.clickToStart.bind(this)
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) return
      let player = {uid: user.uid, ingredients: [], currentCommand: ''}
      this.props.playerJoin(player)
    })
  }

  clickToStart() {
    let commands = []
    let ingredients = []
    let playerNum = this.props.players.length

    lodash.shuffle(Object.keys(ingredientsCommands)).slice(0, playerNum*4).forEach(ingredient => {
      ingredients.push(ingredient)
      commands.push(ingredientsCommands[ingredient])
    })

    this.props.startGame(true, commands, ingredients)
  }

  render() {
    console.log('>>>>>players', this.props.players)
    let currentPlayer
    this.props.players && this.props.players.forEach(player => {
      if (player.uid === firebase.auth().currentUser.uid) {
        currentPlayer = player
      }
    })
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
  {playerJoin, startGame, addRightIngredient, commandExpired, updateScore, stageOver},
)(PlayInterface)
