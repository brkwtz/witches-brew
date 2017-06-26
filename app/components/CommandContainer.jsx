import {Route} from 'react-router'
import firebase from 'APP/fire'

import React from 'react'

import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {Provider} from 'react-redux'

import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import reducer from './reducers'

const db = firebase.database()

import Command from './Command'
import Timer from './Timer'

// This component is a little piece of glue between React router
// and our whiteboard component. It takes in props.params.title, and
// shows the whiteboard along with that title.
export default class CommandContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount(props) {
    function timer(secs) {
    let interval = setInterval(() => {
      if (secs===0) clearInterval(interval)
      props.player.timer = secs
      secs--
      }, 1000)
    }

    timer(7)
  }

  render() {
    let props=this.props.props
    console.log('container props', props)
    return (
      <div>
        <Timer props={props} />
        <Command />
      </div>
    )
  }
}
