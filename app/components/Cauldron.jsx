import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import ingredientsCommands from '../assets/commands.json'

export const Cauldron = () => {
  let cauldronImg = '/gifs/cauldron.gif'
  return (
    <div>
      <img className="cauldron" id="cauldron" src={cauldronImg} />
    </div>
  )
}

export default connect(
  ({level, score}) => ({level, score}),
)(Cauldron)
