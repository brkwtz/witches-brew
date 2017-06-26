import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, startGame, addIngredient, commandExpired, updateScore, stageOver} from './reducers'

export class Ingredients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      players: this.props.players,
      currentCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand,
      resultMsg: '',
      win: this.props.win
    }

    this.selectIngredient = this.selectIngredient.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({players: newProps.players})
    this.setState({currentCommand: newProps.players[firebase.auth().currentUser.uid].currentCommand})
    this.setState({win: newProps.win})
  }

  selectIngredient(ingredient) {
    this.props.addIngredient(ingredient)
  }

  render() {
    const ingredients = this.props.currentPlayer.ingredients
    return (
      <div>
        <hr />
        <h1>{this.state.currentCommand}</h1>
        <hr />
        <h2>{this.state.resultMsg}</h2>
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
