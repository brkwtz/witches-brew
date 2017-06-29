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
      levelEnd: this.props.levelEnd
    }

    this.md = new MobileDetect(window.navigator.userAgent);
    // let md = new MobileDetect(
    //     'Mozilla/5.0 (Linux; U; Android 4.0.3; en-in; SonyEricssonMT11i' +
    //     ' Build/4.1.A.0.562) AppleWebKit/534.30 (KHTML, like Gecko)' +
    //     ' Version/4.0 Mobile Safari/534.30');
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
    console.log('are you accessing witches brew on', this.md.userAgent())
    const ingredients = this.props.currentPlayer.ingredients
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
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  {playerJoin, startGame, addIngredient, commandExpired},
)(Ingredients)
