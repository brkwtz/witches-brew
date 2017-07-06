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
    // let commArr = this.props.players[firebase.auth().currentUser.uid].currentCommand
    // if(!commArr){commArr = []}

    // if(!this.allComms.includes(commArr)){
    //   this.allComms.push(commArr)
    // }

    // Object.keys(this.props.players).forEach(uid=> {
    //   let yours = (uid === firebase.auth().currentUser.uid)
    //   if(!this.otherComms.includes(this.props.players[uid].currentCommand && !yours)){
    //     this.otherComms.push(this.props.players[uid].currentCommand)
    //   }
    // })

    // let notYours = [];
    // this.otherComms.forEach(comm => {
    //   if(!this.allComms.includes(comm)){
    //     notYours.push(comm)
    //   }
    // })

    if (xOffSet <= 200 && yOffSet <= 200) {
      if (elem.ingredient === 'bellows' || elem.ingredient === 'sand') {
        document.querySelectorAll('.fire')[0].src = '/gifs/fire.gif'
      } else if (document.querySelectorAll('.fire')[0]) {
        document.querySelectorAll('.fire')[0].src = '/gifs/blank.gif'
      }

      this.props.addIngredient(elem.ingredient)
      elem.position.x = 0
      elem.position.y = 0

      // let theEl = elem.ingredient.split(' ')[0]
      // if(theEl === 'druty'){theEl = 'druzy'} // lol

      // let otherPlayerHasCommand;

      // notYours.forEach(el => {
      //   if(el.split(' ').includes(theEl)){
      //     return otherPlayerHasCommand = true;
      //   }
      // })

      // if(elem.ingredient !== 'sand' && otherPlayerHasCommand){
      //   document.getElementById('added').textContent = 'added for other witch!'
      //   setTimeout(() => { document.getElementById('added').textContent = ''
      //   }, 2000)
      // }

      // if(elem.ingredient !== 'sand' && this.allComms[this.allComms.length-1].split(' ').includes(theEl)){
      //   document.getElementById('added').textContent = 'added!'
      //   setTimeout(() => { document.getElementById('added').textContent = ''
      //   }, 2000)
      // }
      // if(elem.ingredient === 'spoon'){
      //   document.getElementById('added').textContent = 'stirring!'
      //   setTimeout(() => { document.getElementById('added').textContent = ''
      //   }, 2000)
      // }
    } else {
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
