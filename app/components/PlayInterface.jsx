import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
// import command component(includes timer), ingredients component
import Cauldron from './Cauldron'
import Command from './Command'
import Ingredients from './Ingredients'

import {playerJoin, startGame, addIngredient, commandExpired, updateScore, stageOver} from './reducers'

export class PlayInterface extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    this.props.fireRef.push('insert game data here')
    return (
      <div>
        <h1> Witches Brew </h1>
        <Cauldron />
        <Command />
        <Ingredients />
      </div>
    )
  }
}

export default connect(
  ({gameStarted, players, ingredients, commands, score, level}) => ({gameStarted, players, ingredients, commands, score, level}),
  {playerJoin, startGame, addIngredient, commandExpired, updateScore, stageOver},
)(PlayInterface)
