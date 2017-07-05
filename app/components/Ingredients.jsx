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
      currentCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand,
      win: this.props.win,
      levelEnd: this.props.levelEnd,
      elems: [],
      cauldronPos: {x: 0, y: 0},
    }
    // this.md = new MobileDetect(window.navigator.userAgent)
    // this.drag = this.drag.bind(this)
  }

  componentDidMount() {
    this.setState({elems: document.querySelectorAll('.ingredientImg')})

    // let cauldron = document.getElementById('cauldron')
    // let position = cauldron.getBoundingClientRect()
    // let x = position.left
    // let y = position.top
    //
    // this.setState({cauldronPos: {x, y}})
  }

  componentWillReceiveProps(newProps) {
    this.setState({currentCommand: newProps.players[firebase.auth().currentUser.uid].currentCommand})
    this.setState({win: newProps.win})
    this.setState({levelEnd: newProps.levelEnd})
  }
  //
  // drag(e, pointer, elem) {
  //
  //   e.preventDefault();
  //   let ingX = pointer.pageX
  //   let ingY = pointer.pageY
  //   let xOffSet = this.state.cauldronPos.x - ingX
  //   let yOffSet = this.state.cauldronPos.y - ingY
  //
  //   if (xOffSet <= 200 && yOffSet <= 200){
  //     this.props.addIngredient(elem.ingredient)
  //     elem.position.x = 0;
  //     elem.position.y = 0;
  //   }
  // }
  //
  // get mobilePlayer() {
  //   let detect = this.md.ua
  //   let playingOnA = detect.slice((detect.indexOf('(') + 1), detect.indexOf(';'))
  //   if (playingOnA === 'iPhone' || playingOnA === 'Android') {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  render() {
    const ingredients = this.props.currentPlayer.ingredients
    //
    // draggable="true" onDragStart={this.drag}
    // let isMobile = this.mobilePlayer;
    //
    // let elems = this.state.elems
    //
    // let draggableElems = []
    //
    // for (var i=0, len = elems.length; i < len; i++) {
    //   let selectedElem = elems[i]
    //   let dragElem = new Draggabilly(selectedElem, {
    //     // containment: '.main'
    //   })
    //
    //   dragElem.ingredient = selectedElem.id
    //   dragElem.on('pointerUp', (e, pointer) => {
    //     this.drag(e, pointer, dragElem)
    //   })
    //   draggableElems.push(dragElem)
    // }
    let ingredientImage
    return (
      <div>
        <div className="row">
          <h1>{this.state.currentCommand}</h1>
        </div>
        <div id="ingredients" className="row">
        <table>
          <tbody>
            <tr>
            {
              ingredients && ingredients.map((ingredient, idx) => {
                ingredientImage = '/gifs/ingredients/' + ingredient.split(' ').join('-') + '.gif'
                return (
                      <td key={idx}>
                        <img className="ingredientImg" id={ingredient} onClick={() => this.props.addIngredient(ingredient)} src={ingredientImage} />
                    </td>
                )
              })
            }
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  {playerJoin, startGame, addIngredient, commandExpired},
)(Ingredients)
