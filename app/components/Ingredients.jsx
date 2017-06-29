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

  drag(e) {
    e.dataTransfer.setData('ingredient', e.target.id)
  }

  render() {
    const ingredients = this.props.currentPlayer.ingredients
    let imgsPerRow = Math.ceil(ingredients.length / 2)
    let imgWidth = Math.floor(100 / imgsPerRow - 5)
    console.log('width: ', imgWidth)
    return (
      <div>
        <div className="row">
          <h1 >{this.state.currentCommand}</h1>
        </div>
        <div className="row">
          {
            ingredients && ingredients.map((ingredient, idx) => (
              <span key={idx} width={`${imgWidth}%`}>
                <img className="ingredientImg" id={ingredient} draggable="true" onDragStart={this.drag} src="/gifs/dummyIngredient.png" />({ingredient})
              </span>
              ))
          }
        </div>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  {playerJoin, startGame, addIngredient, commandExpired},
)(Ingredients)
