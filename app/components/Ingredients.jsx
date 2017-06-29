import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

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
      touching: 'you are not touching me'
    }
    this.md = new MobileDetect(window.navigator.userAgent);
    this.drag = this.drag.bind(this)
    this.touching = this.touching.bind(this)
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
    if(playingOnA === 'iPhone' || playingOnA === 'Android'){return true}
    else {return false}
  }

  touching(){
    this.setState({touching: 'you ARE touching me!!'})
  }

  render() {
    
    const ingredients = this.props.currentPlayer.ingredients
    let isMobile = this.mobilePlayer;

    return (
      <div>
        <h1 >{this.state.currentCommand}</h1>
        <hr />
        <h3>Ingredients</h3>
        {
          ingredients && ingredients.map((ingredient, idx) => (
            <div className="col-sm-3" key={idx}>
              <img id={ingredient} draggable="true" onDragStart={this.drag} src="/gifs/dummyIngredient.png" /> <br/> ({ingredient})
            </div>
            ))
        }
        <div>
        <h1>{this.state.touching}</h1>
        <img src="/gifs/poof1.gif" draggable="true" onTouchMove={this.touching}/>
        </div>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  {playerJoin, startGame, addIngredient, commandExpired},
)(Ingredients)
