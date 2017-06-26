import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, startGame, addIngredient, commandExpired, updateScore, stageOver} from './reducers'

export class Ingredients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      players: this.props.players,
      currentCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand,
      resultMsg: '',
      win: this.props.win,
      timer: null,
      counter: 0
    }
    this.selectIngredient = this.selectIngredient.bind(this)
    this.tick = this.tick.bind(this)
  }

  componentDidMount() {
    //reliant on the level
    let sec = 0;
    if(this.props.level <= 2){sec = 600}
    else {sec = 400}
    let timer = setInterval(this.tick, sec)
    this.setState({timer})
  }

  componentWillUnmount(){
    clearInterval(this.state.timer)
  }

  tick() {
    if(this.props.commands.length >= 0){
    this.setState({
      counter: this.state.counter + 10
    })
    let purpleBar = document.getElementById("purpleBar")
    purpleBar.style.width = this.state.counter + '%'

    if(this.state.counter >= 100){
      
      //reset the interval, and the bar style, and the state counter
      clearInterval(this.state.timer)
      this.setState({
        counter: 0
      })
      purpleBar.style.width = 0 + '%'

      console.log('now expired')

      //get a new command
      this.props.commandExpired(this.props.commands)

      //if there's another command, restart the timer
      if(this.props.commands.length >= 0){
        let sec = 0;
        if(this.props.level <= 2){sec = 600}
        else {sec = 400}
        let timer = setInterval(this.tick, sec)
        this.setState({timer: timer})
        console.log(this.props.commands)
      }

      console.log('commands go down to 0!!!!!!')
      clearInterval(this.state.timer)
      this.setState({timer: null})

    }

    // if(this.props.commands.length === 0){
    //       console.log('commands go down to 0!!!!!!')
    //       clearInterval(this.state.timer)
    //       this.setState({timer: null})
    //   }
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({players: newProps.players})
    this.setState({currentCommand: newProps.players[firebase.auth().currentUser.uid].currentCommand})
    this.setState({win: newProps.win})
  }

  selectIngredient(ingredient) {
    this.props.addIngredient(ingredient)
    let sec = 0;
    if(this.props.level <= 2){sec = 600}
    else {sec = 400}
    let timer = setInterval(this.tick, sec)
    this.setState({timer})
  }

  render() {
    const ingredients = this.props.currentPlayer.ingredients
    return (
      <div>
        <hr />
        <h1>{this.state.currentCommand}</h1>
        <hr />
        <h2>{this.state.resultMsg}</h2>
        <hr />
        <div id="greyBar">
        <div id="purpleBar"></div></div>
        <h3>Ingredients</h3>
        {
          ingredients && ingredients.map((ingredient, idx) => (
              <div key={idx}>
                <button onClick={() => this.selectIngredient(ingredient)}> {ingredient} </button>
              </div>
            ))
        }
        <div> Loading {this.state.counter}</div>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win}) => ({gameStarted, players, ingredients, commands, score, level, win}),
  {playerJoin, startGame, addIngredient, commandExpired, updateScore, stageOver},
)(Ingredients)

