import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, startGame, addIngredient, commandExpired} from './reducers'

export class Ingredients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand,
      win: this.props.win,
      levelEnd: this.props.levelEnd
    }
    this.drag = this.drag.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({currentCommand: newProps.players[firebase.auth().currentUser.uid].currentCommand})
    this.setState({win: newProps.win})
    this.setState({levelEnd: newProps.levelEnd})
  }

  drag(e){
    console.log('dragging')
    console.log('ingredient being dragged is:', e.target.id)
    e.dataTransfer.setData("ingredient", e.target.id)
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
              <p key="idx"> {ingredient}
                <img key={idx} id={ingredient} draggable="true" onDragStart={this.drag} src="/gifs/dummyIngredient.png" />
              </p>
            ))
        }
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  {playerJoin, startGame, addIngredient, commandExpired},
)(Ingredients)
