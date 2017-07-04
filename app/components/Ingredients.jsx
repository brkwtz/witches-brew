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
      // currentCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand,
      // win: this.props.win,
      // levelEnd: this.props.levelEnd,
      elems: [],
      cauldronPos: {x: 0, y: 0}
    }
    // this.md = new MobileDetect(window.navigator.userAgent)
    this.drag = this.drag.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
  }

  componentDidMount() {
    this.setState({elems: document.querySelectorAll('.ingredientImg')})

    const cauldron = document.getElementById('cauldron')
    const position = cauldron.getBoundingClientRect()
    const x = position.left
    const y = position.top

    this.setState({cauldronPos: {x, y}})
  }

  // componentWillReceiveProps(newProps) {
  //   this.setState({currentCommand: newProps.players[firebase.auth().currentUser.uid].currentCommand})
  //   this.setState({win: newProps.win})
  //   this.setState({levelEnd: newProps.levelEnd})
  // }

  drag(e, pointer, elem) {
    e.preventDefault()
    const ingX = pointer.pageX
    const ingY = pointer.pageY
    const cauldronX = this.state.cauldronPos.x
    const cauldronY = this.state.cauldronPos.y
    const cauldronWidth = this.state.cauldronPos.x + 200
    const cauldronHeight = this.state.cauldronPos.y + 200
    // let xOffSet = this.state.cauldronPos.x - ingX
    // let yOffSet = this.state.cauldronPos.y - ingY

    console.log(ingX, ingY)
    if ((ingX >= cauldronX && ingX <= cauldronWidth) && (ingY >= cauldronY && ingY <= cauldronHeight)) {
      console.log('dispatch addIngredient')
      this.props.addIngredient(elem.ingredient)
      elem.position.x = 0
      elem.position.y = 0
    }
  }

  handleDrag(event) {
    console.log('react synthetic event! *** ', event)
    let elems = this.state.elems
    let draggableElems = []

    for (var i=0, len = elems.length; i < len; i++) {
      let selectedElem = elems[i]
      let dragElem = new Draggabilly(selectedElem, {
        // containment: '.main'
      })

      dragElem.ingredient = selectedElem.id
      dragElem.on('pointerUp', (e, pointer) => {
        this.drag(e, pointer, dragElem)
      })
      draggableElems.push(dragElem)
    }
  }

  // mobilePlayer() {
  //   let detect = this.md.ua
  //   let playingOnA = detect.slice((detect.indexOf('(') + 1), detect.indexOf(';'))
  //   if (playingOnA === 'iPhone' || playingOnA === 'Android') {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  render() {
    console.log('CAULDRON POSITION:', this.state.cauldronPos.x, this.state.cauldronPos.y)
    const ingredients = this.props.currentPlayer.ingredients
    // let isMobile = this.mobilePlayer

    let ingredientImage
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
                  <img className="ingredientImg" id={ingredient} draggable="true" onDragEnd={this.handleDrag} src={ingredientImage} />
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
