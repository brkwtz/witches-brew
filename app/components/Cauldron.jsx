import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import Draggabilly from 'draggabilly'
import ingredientsCommands from '../assets/commands.json'
import {addIngredient} from './reducers'

export const Cauldron = () => {
  let cauldronImg = '/gifs/cauldron.gif'
  return (
    <div>
      <img className="cauldron" id="cauldron" src={cauldronImg} />
    </div>
  )
}

export default connect(
  ({ingredients, level, score}) => ({ingredients, level, score}),
  {addIngredient},
)(Cauldron)
