import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
// import command component(includes timer), ingredients component
import Cauldron from './Cauldron'
import CommandContainer from './CommandContainer'
import Ingredients from './Ingredients'
import lodash from 'lodash'

// import ingredientsJson from '../assets/ingredients.json'
import ingredientCommands from '../assets/commands.json'
import {playerJoin, startGame, addRightIngredient, commandExpired, updateScore, stageOver} from './reducers'

export class PlayInterface extends React.Component {
  constructor(props) {
    super(props)
    this.clickToStart = this.clickToStart.bind(this)
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) return
      let player = {uid: user.uid, ingredients: [], commands: []}
      this.props.playerJoin(player)
    })
  }

  clickToStart() {
    let commands = []
    let ingredients = []
    let playerNum = this.props.players.length

    lodash.shuffle(Object.keys(ingredientCommands)).slice(0, playerNum*4).forEach(ingredient => {
      ingredients.push(ingredient)
      commands.push(ingredientCommands[ingredient])
    })

    this.props.startGame(true, commands, ingredients)
  }

  render() {
    console.log('>>>>>players', this.props.players)
    console.log('>>>>>props', this.props)
    return (
      <div>
        <h1> Witches Brew </h1>
        {
          (this.props.gameStarted)
            ? (
            <h1>game started</h1>
          )
            : (
            <button onClick={this.clickToStart}>Start</button>
          )
        }
    <Cauldron />
    <CommandContainer props={this.props} />
    <Ingredients />
    </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level}) => ({gameStarted, players, ingredients, commands, score, level}),
  {playerJoin, startGame, addRightIngredient, commandExpired, updateScore, stageOver},
)(PlayInterface)
