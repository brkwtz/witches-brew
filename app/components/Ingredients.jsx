import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import Draggabilly from 'draggabilly'


const MobileDetect = require('mobile-detect')


import ingredientsCommands from '../assets/commands.json'
import {playerJoin, startGame, addIngredient, commandExpired} from './reducers'

export class Ingredients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand,
      win: this.props.win,
      levelEnd: this.props.levelEnd,
      elems: []
    }
    this.md = new MobileDetect(window.navigator.userAgent)
    this.drag = this.drag.bind(this)
    this.turtle = this.turtle.bind(this)
  }
  
  componentDidMount() {
    this.setState({elems: document.querySelectorAll('.draggable')})
  }


  componentWillReceiveProps(newProps) {
    this.setState({currentCommand: newProps.players[firebase.auth().currentUser.uid].currentCommand})
    this.setState({win: newProps.win})
    this.setState({levelEnd: newProps.levelEnd})
  }

  drag(e) {
    console.log(e)
    e.dataTransfer.setData('ingredient', e.target.id)
  }
  
  get mobilePlayer() {
    let detect = this.md.ua
    let playingOnA = detect.slice((detect.indexOf('(') + 1), detect.indexOf(';'))
    if(playingOnA === 'iPhone' || playingOnA === 'Android'){return true}
    else {return false}
  }

  turtle(event){
    console.log('hi turtle')
    console.log(event.target.value, 'says hi')
  }

  render() {
    
    const ingredients = this.props.currentPlayer.ingredients
    let isMobile = this.mobilePlayer;
    let elems = this.state.elems

      let draggableElems = []
      // init Draggabillies
      for ( var i=0, len = elems.length; i < len; i++ ) {
        let selectedElem = elems[i];
        let dragElem = new Draggabilly( selectedElem, {
          // containment: '.main'
        })
        dragElem.ingredient = selectedElem.id
        //dragElem.ingredient = selectedElem.id
        dragElem.on( 'dragMove', ( event, pointer, moveVector ) => {
          //console.log(event)
          this.turtle
        })
      
        draggableElems.push(dragElem)
      }

      // <img src="/gifs/poof1.gif"  value="turtle" onDragStart={this.turtle}/>

      //console.log(draggableElems[0].element.getBoundingClientRect())

    console.log('with ingredient added', draggableElems)  

    return (
      <div>
        <h1 >{this.state.currentCommand}</h1>
        <hr />
        <h3>Ingredients</h3>
        {
          ingredients && ingredients.map((ingredient, idx) => (
            <div className="col-sm-3" key={idx}>
              <img id={ingredient} className="draggable" onDragStart={this.drag} src="/gifs/dummyIngredient.png" /> <br/> ({ingredient})
            </div>
            ))
        }
        <div>   
       
        </div>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  {playerJoin, startGame, addIngredient, commandExpired},
)(Ingredients)
