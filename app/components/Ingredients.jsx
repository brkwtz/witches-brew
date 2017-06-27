import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'

import ingredientsCommands from '../assets/commands.json'
import {playerJoin, startGame, addIngredient, commandExpired} from './reducers'

export class Ingredients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCommand: this.props.players[firebase.auth().currentUser.uid].currentCommand,
<<<<<<< HEAD
      resultMsg: '',
      win: this.props.win,
      timer: null,
      counter: 0
=======
      win: this.props.win,
      levelEnd: this.props.levelEnd
>>>>>>> f6ec0d0961d94e232bcdfea9161011d5facf6bd9
    }
    this.selectIngredient = this.selectIngredient.bind(this)
    this.tick = this.tick.bind(this)
  }

  componentDidMount() {
    // reliant on the level
    let sec = 0
    if (this.props.level <= 2) {
      sec = 600
    } else { sec = 400 }
    const timer = setInterval(this.tick, sec)
    this.setState({timer})
  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  tick() {
    let numLoops = this.props.commands.length + 1
    if (numLoops >= 0) {
      this.setState({
        counter: this.state.counter + 10
      })

      const purpleBar = document.getElementById('purpleBar')
      purpleBar.style.width = this.state.counter + '%'

      if (this.state.counter >= 100) {
        // reset the interval, and the bar style, and the state counter
        clearInterval(this.state.timer)

        this.setState({
          counter: 0
        })

        purpleBar.style.width = 0 + '%'

        console.log('now expired')

        // get a new command
        this.props.commandExpired(this.props.commands)

        // if there's another command, restart the timer
        if (numLoops >= 0) {
          let sec = 0

          if (this.props.level <= 2) {
            sec = 600
          } else {
            sec = 400
          }

          const timer = setInterval(this.tick, sec)
          this.setState({timer: timer})
          console.log(this.props.commands)
          numLoops--
        }

        if (numLoops === 0) {
          console.log('commands go down to 0!!!!!!')
          clearInterval(this.state.timer)
          this.setState({timer: null})
        }
      }
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({currentCommand: newProps.players[firebase.auth().currentUser.uid].currentCommand})
    this.setState({win: newProps.win})
    this.setState({levelEnd: newProps.levelEnd})
  }

  selectIngredient = (ingredient) => () => {
    this.props.addIngredient(ingredient)
    let sec = 0
    if (this.props.level <= 2) {
      sec = 600
    } else {
      sec = 400
    }
    const timer = setInterval(this.tick, sec)
    this.setState({timer})
  }

  render() {
    const ingredients = this.props.currentPlayer.ingredients
    return (
      <div>
        <h1>{this.state.currentCommand}</h1>

        <hr />
        <div id="greyBar">
        <div id="purpleBar"></div></div>
        <h3>Ingredients</h3>
        {
          ingredients && ingredients.map((ingredient, idx) => (
              <div key={idx}>
                <button onClick={this.selectIngredient(ingredient)}> {ingredient} </button>
              </div>
            ))
        }
        <div> Loading {this.state.counter}</div>
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}) => ({gameStarted, players, ingredients, commands, score, level, win, levelEnd}),
  {playerJoin, startGame, addIngredient, commandExpired},
)(Ingredients)
