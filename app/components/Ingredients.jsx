import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

const MobileDetect = require('mobile-detect')

import {playerJoin, startGame, addIngredient, commandExpired} from './reducers'

export class Ingredients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand,
      win: this.props.win,
      levelEnd: this.props.levelEnd
    }
    this.md = new MobileDetect(window.navigator.userAgent)
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

  get mobilePlayer() {
    let detect = this.md.ua
    let playingOnA = detect.slice((detect.indexOf('(') + 1), detect.indexOf(';'))
    if (playingOnA === 'iPhone' || playingOnA === 'Android') {
      return true
    } else {
      return false
    }
  }

  render() {
    const ingredients = this.props.currentPlayer.ingredients
    return (
      <div>
        <div className="row">
          <h1 >{this.state.currentCommand}</h1>
        </div>
        <div className="row">
          {
            ingredients && ingredients.map((ingredient, idx) => (
              <span key={idx}>
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
