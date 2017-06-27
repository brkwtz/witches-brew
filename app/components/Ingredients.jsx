import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import ingredientsCommands from '../assets/commands.json'
import reducer from './reducers'

export class Ingredients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand,
      win: this.props.win,
      levelEnd: this.props.levelEnd
    }

    this.selectIngredient = this.selectIngredient.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({currentCommand: newProps.players[firebase.auth().currentUser.uid].currentCommand})
    this.setState({win: newProps.win})
    this.setState({levelEnd: newProps.levelEnd})
  }

  selectIngredient = (ingredient) => () => {
    this.props.addIngredient(ingredient)
  }

  render() {
    const ingredients = this.props.currentPlayer.ingredients
    return (
      <div>
        <h1>{this.state.currentCommand}</h1>

        <hr />
        <h3>Ingredients</h3>
        {
          ingredients && ingredients.map((ingredient, idx) => (
              <div key={idx}>
                <button onClick={this.selectIngredient(ingredient)}> {ingredient} </button>
              </div>
            ))
        }
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  reducer,
)(Ingredients)
