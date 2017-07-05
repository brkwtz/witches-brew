import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import Draggabilly from 'draggabilly'

const MobileDetect = require('mobile-detect')

import {playerJoin, startGame, addIngredient, commandExpired} from './reducers'

export class Ingredients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      elems: [],
      cauldronPos: {x: 0, y: 0}
    }
    this.drag = this.drag.bind(this)
  }

  componentDidMount() {
    this.setState({elems: document.querySelectorAll('.ingredientImg')})
    const cauldron = document.getElementById('cauldron')
    const position = cauldron.getBoundingClientRect()
    const x = position.left
    const y = position.top

    this.setState({cauldronPos: {x, y}})
  }

  drag(e, pointer, elem) {
    e.preventDefault()
    let ingX = pointer.pageX
    let ingY = pointer.pageY
    let xOffSet = this.state.cauldronPos.x - ingX
    let yOffSet = this.state.cauldronPos.y - ingY

    if (xOffSet <= 200 && yOffSet <= 200) {
      this.props.addIngredient(elem.ingredient)
      elem.position.x = 0
      elem.position.y = 0
    }
  }

  render() {
    const ingredients = this.props.currentPlayer.ingredients
    let ingredientImage

    let elems = this.state.elems
    let draggableElems = []

    for (var i=0, len = elems.length; i < len; i++) {
      let selectedElem = elems[i]
      let dragElem = new Draggabilly(selectedElem, {})

      dragElem.ingredient = selectedElem.id
      dragElem.on('pointerUp', (e, pointer) => {
        window.alert('ingredient added!')
        this.drag(e, pointer, dragElem)
      })
      draggableElems.push(dragElem)
    }

    return (
      <div>
        <div className="row">
          <h1 >{this.props.players[firebase.auth().currentUser.uid].currentCommand}</h1>
        </div>
        <div className="row">
          {
            ingredients && ingredients.map((ingredient, idx) => {
              ingredientImage = '/gifs/ingredients/' + ingredient.split(' ').join('-') + '.gif'
              return (
                <span key={idx}>
                  <img className="ingredientImg" id={ingredient} draggable="true" onDragStart={this.drag} src={ingredientImage} />
                </span>
              )
            })
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
