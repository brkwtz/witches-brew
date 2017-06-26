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

    // this.setState({resultMsg: ''})
    //
    // if (ingredientsCommands[ingredient] === this.state.currentCommand) {
    //   this.props.addIngredient(this.props.currentPlayer)
    //
    //   this.setState({resultMsg: 'You Got It!!!'})
    //   if (this.props.commands.length <= 1) {
    //     this.props.stageOver()
    //     if (this.state.win) {
    //       this.setState({resultMsg: 'Congrats, you successfully brewed the posion!!!'})
    //     }
    //   }
    // } else {
    //   this.setState({resultMsg: 'Sorry, Wrong Ingredient!!!'})
    // }
  }

  render() {
    console.log('ingredient props', this.props)
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
