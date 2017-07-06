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
      cauldronPos: {x: 0, y: 0},
      commandClass: 'new4',
      currCommand: ''
    }
    this.drag = this.drag.bind(this)
    this.otherComms = []
    this.allComms = []
  }

  componentDidMount() {
    this.setState({elems: document.querySelectorAll('.ingredientImg')})
    const cauldron = document.getElementById('cauldron')
    const position = cauldron.getBoundingClientRect()
    const x = position.left
    const y = position.top
    

    this.setState({cauldronPos: {x, y}, currCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand})
}

  drag(e, pointer, elem) {
    e.preventDefault()
    let ingX = pointer.pageX
    let ingY = pointer.pageY
    let xOffSet = this.state.cauldronPos.x - ingX
    let yOffSet = this.state.cauldronPos.y - ingY
    let commArr = this.props.players[firebase.auth().currentUser.uid].currentCommand
    if(!commArr){commArr = []}

    if(!this.allComms.includes(commArr)){
      this.allComms.push(commArr)
    }
    

    Object.keys(this.props.players).forEach(uid=> {
      if(!this.otherComms.includes(this.props.players[uid].currentCommand)){
        this.otherComms.push(this.props.players[uid].currentCommand)
      }
    })

    if (xOffSet <= 200 && yOffSet <= 200) {
      if (elem.ingredient === 'bellows' || elem.ingredient === 'sand') {
        document.querySelectorAll('.fire')[0].src = '/gifs/fire.gif'
      } else {
        document.querySelectorAll('.fire')[0].src = ''
      }

      this.props.addIngredient(elem.ingredient)
      elem.position.x = 0
      elem.position.y = 0

      //otherComms[0].split(' ').includes(elem.ingredient
      // || or the one before
      console.log(this.allComms[this.allComms.length-1].split(' ').includes(elem.ingredient.split(' ')[0]))
      console.log(this.allComms[this.allComms.length-1].split(' '), elem.ingredient[0].split(' ')[0])
      if(this.allComms[this.allComms.length-1].split(' ').includes(elem.ingredient) || this.allComms[this.allComms.length-2] && this.allComms[this.allComms.length-2].split(' ').includes(elem.ingredient)){
        document.getElementById('added').textContent = 'added!'
        console.log('added text!')
        setTimeout(() => { document.getElementById('added').textContent = ''
        }, 2000)
      }
      
    }else{
      elem.position.x = 0
      elem.position.y = 0
    }
  }

  render() {
    const ingredients = this.props.currentPlayer.ingredients
    let isMobile = this.mobilePlayer
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

    let ingredientImage
    return (
      <div>
        <div className="row">
          <h1>{this.props.players[firebase.auth().currentUser.uid].currentCommand || 'waiting for other witches to finish!'}</h1>
          <h2 id="added"></h2>
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
