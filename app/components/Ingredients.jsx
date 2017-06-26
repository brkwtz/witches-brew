import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, startGame, addIngredient, commandExpired, updateScore, stageOver} from './reducers'

export class Ingredients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand,
      win: this.props.win
    }

    this.selectIngredient = this.selectIngredient.bind(this)
    this.countDown = this.countDown.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({currentCommand: newProps.players[firebase.auth().currentUser.uid].currentCommand})
    this.setState({win: newProps.win})

    // if no witch has command, dispatch stageOver
    if (Object.keys(newProps.players).every(uid => !newProps.players[uid].currentCommand)) {
      this.props.stageOver()
      // TO:DO
      // if this.state.win redirect to => levelUp page, and go to next level by redirect by to the game again
      // else (lose) => gameOver => delete the room from firebase
    }
  }

  countDown() {
    setInterval(() => { this.setState({timer: this.state.timer--}) }, 1000)
  }

  selectIngredient(ingredient) {
    this.props.addIngredient(ingredient)
  }

  render() {
    const ingredients = this.props.currentPlayer.ingredients
    return (
      <div>
        <h1>Timer: {}</h1>
        <hr />
        <h1>{this.state.currentCommand}</h1>

        <hr />
        <h3>Ingredients</h3>
        {
          ingredients && ingredients.map((ingredient, idx) => (
              <div key={idx}>
                <button onClick={() => this.selectIngredient(ingredient)}> {ingredient} </button>
              </div>
            ))
        }
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win}) => ({gameStarted, players, ingredients, commands, score, level, win}),
  {playerJoin, startGame, addIngredient, commandExpired, updateScore, stageOver},
)(Ingredients)
