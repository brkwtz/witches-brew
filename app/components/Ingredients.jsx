import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, startGame, addRightIngredient, commandExpired, updateScore, stageOver} from './reducers'

export class Ingredients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCommand: this.props.currentPlayer.currentCommand,
      resultMsg: '',
      win: this.props.win
    }

    this.selectIngredient = this.selectIngredient.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({currentCommand: newProps.currentPlayer.currentCommand})
    this.setState({win: newProps.win})
  }

  selectIngredient(ingredient) {
    this.setState({resultMsg: ''})

    if (ingredientsCommands[ingredient] === this.state.currentCommand) {
      this.props.addRightIngredient(this.props.currentPlayer)

      this.setState({resultMsg: 'You Got It!!!'})
      if (this.props.commands.length <= 1) {
        this.props.stageOver()
        if (this.state.win) {
          this.setState({resultMsg: 'Congrats, you successfully brewed the posion!!!'})
        }
      }
    } else {
      this.setState({resultMsg: 'Sorry, Wrong Ingredient!!!'})
    }
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
  {playerJoin, startGame, addRightIngredient, commandExpired, updateScore, stageOver},
)(Ingredients)
