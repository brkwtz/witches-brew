import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
// import command component(includes timer), ingredients component
import Cauldron from './Cauldron'
import Command from './Command'
import Ingredients from './Ingredients'

// import {} from './reducers'

export default (props) => {
  props.fireRef.push('insert game data here')
  return (
    <div>
      <h1> Witches Brew </h1>
      <Cauldron />
      <Command />
      <Ingredients />
    </div>
  )
}
