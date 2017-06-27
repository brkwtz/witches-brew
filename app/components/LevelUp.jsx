import React from 'react'
import firebase from 'APP/fire'
import {connect} from 'react-redux'
import {stageOver} from './reducers'

export const LevelUp = (props) => {
  return (
    <div>
      <h1>LEVEL UP COMPONENT</h1>
      <h2>Current Level is {props.level}</h2>
    </div>
  )
}

export default connect(
  ({score, level}) => ({score, level}),
  {stageOver},
)(LevelUp)
